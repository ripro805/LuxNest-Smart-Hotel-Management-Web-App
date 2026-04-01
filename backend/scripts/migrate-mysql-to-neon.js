const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const { Pool } = require('pg');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

function toDateOnly(value) {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

async function main() {
  const neonUrl = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;
  if (!neonUrl) {
    throw new Error('NEON_DATABASE_URL (or DATABASE_URL) is required');
  }

  const mysqlConn = await mysql.createConnection({
    host: process.env.MYSQL_HOST || process.env.DB_HOST || 'localhost',
    user: process.env.MYSQL_USER || process.env.DB_USER || 'root',
    password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || '',
    database: process.env.MYSQL_DB || process.env.DB_NAME || 'hotel_management',
    port: Number(process.env.MYSQL_PORT || process.env.DB_PORT || 3306)
  });

  const pgPool = new Pool({
    connectionString: neonUrl,
    ssl: { rejectUnauthorized: false }
  });

  const pgClient = await pgPool.connect();

  try {
    const sqlPath = path.resolve(__dirname, '../../database/hotel_management_postgres.sql');
    const schemaSql = fs.readFileSync(sqlPath, 'utf8');
    await pgClient.query(schemaSql);

    const [customers] = await mysqlConn.query('SELECT id, name, email, phone, note, status, created_at FROM customers ORDER BY id');
    const [staffs] = await mysqlConn.query('SELECT id, name, email, phone, designation, joined_at, created_at FROM staffs ORDER BY id');
    const [rooms] = await mysqlConn.query('SELECT id, room_number, type, status, price, notes, created_at FROM rooms ORDER BY id');
    const [bookings] = await mysqlConn.query('SELECT id, customer_id, room_id, start_date, end_date, status, created_at FROM bookings ORDER BY id');

    await pgClient.query('BEGIN');
    await pgClient.query('TRUNCATE TABLE bookings, customers, staffs, rooms RESTART IDENTITY CASCADE');

    for (const row of customers) {
      await pgClient.query(
        `INSERT INTO customers (id, name, email, phone, note, status, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [row.id, row.name, row.email, row.phone, row.note, row.status, row.created_at]
      );
    }

    for (const row of staffs) {
      await pgClient.query(
        `INSERT INTO staffs (id, name, email, phone, designation, joined_at, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [row.id, row.name, row.email, row.phone, row.designation, toDateOnly(row.joined_at), row.created_at]
      );
    }

    for (const row of rooms) {
      await pgClient.query(
        `INSERT INTO rooms (id, room_number, type, status, price, notes, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [row.id, row.room_number, row.type, row.status, row.price, row.notes, row.created_at]
      );
    }

    for (const row of bookings) {
      await pgClient.query(
        `INSERT INTO bookings (id, customer_id, room_id, start_date, end_date, status, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [
          row.id,
          row.customer_id,
          row.room_id,
          toDateOnly(row.start_date),
          toDateOnly(row.end_date),
          row.status,
          row.created_at
        ]
      );
    }

    await pgClient.query("SELECT setval('customers_id_seq', COALESCE((SELECT MAX(id) FROM customers), 1), true)");
    await pgClient.query("SELECT setval('staffs_id_seq', COALESCE((SELECT MAX(id) FROM staffs), 1), true)");
    await pgClient.query("SELECT setval('rooms_id_seq', COALESCE((SELECT MAX(id) FROM rooms), 1), true)");
    await pgClient.query("SELECT setval('bookings_id_seq', COALESCE((SELECT MAX(id) FROM bookings), 1), true)");

    await pgClient.query('COMMIT');

    console.log('Migration completed successfully');
    console.log(`customers: ${customers.length}`);
    console.log(`staffs: ${staffs.length}`);
    console.log(`rooms: ${rooms.length}`);
    console.log(`bookings: ${bookings.length}`);
  } catch (error) {
    try {
      await pgClient.query('ROLLBACK');
    } catch (_) {
      // ignore rollback errors
    }
    throw error;
  } finally {
    pgClient.release();
    await pgPool.end();
    await mysqlConn.end();
  }
}

main().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
