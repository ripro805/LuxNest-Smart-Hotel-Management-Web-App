const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

function toPgPlaceholders(sql) {
    let index = 0;
    return sql.replace(/\?/g, () => {
        index += 1;
        return `$${index}`;
    });
}

function normalizeSql(sql) {
    const trimmed = sql.trim();
    const command = trimmed.split(/\s+/)[0].toUpperCase();
    const hasReturning = /\bRETURNING\b/i.test(trimmed);

    if (command === 'INSERT' && !hasReturning) {
        return {
            command,
            sql: `${trimmed} RETURNING id`
        };
    }

    return { command, sql: trimmed };
}

function formatResult(command, result) {
    if (command === 'SELECT' || command === 'WITH') {
        return [result.rows, result.fields || null];
    }

    if (command === 'INSERT') {
        return [
            {
                insertId: result.rows?.[0]?.id ?? null,
                affectedRows: result.rowCount
            },
            result.fields || null
        ];
    }

    return [
        {
            affectedRows: result.rowCount
        },
        result.fields || null
    ];
}

const usingConnectionString = Boolean(process.env.DATABASE_URL);

const pool = new Pool(
    usingConnectionString
        ? {
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
            max: Number(process.env.DB_POOL_MAX || 10)
        }
        : {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'hotel_management',
            port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
            ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
            max: Number(process.env.DB_POOL_MAX || 10)
        }
);

const db = {
    async query(sql, params = []) {
        const normalized = normalizeSql(toPgPlaceholders(sql));
        const result = await pool.query(normalized.sql, params);
        return formatResult(normalized.command, result);
    },

    async getConnection() {
        const client = await pool.connect();
        let released = false;

        const release = () => {
            if (!released) {
                released = true;
                client.release();
            }
        };

        return {
            query: async (sql, params = []) => {
                const normalized = normalizeSql(toPgPlaceholders(sql));
                const result = await client.query(normalized.sql, params);
                return formatResult(normalized.command, result);
            },
            beginTransaction: async () => client.query('BEGIN'),
            commit: async () => client.query('COMMIT'),
            rollback: async () => client.query('ROLLBACK'),
            release
        };
    }
};

module.exports = db;
