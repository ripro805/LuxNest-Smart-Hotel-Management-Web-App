//location: backend/src/routes/customers.js

const express = require('express');
const pool = require('../db');
const router = express.Router();

/**
 * GET /api/customers
 * query: search (name/email), status
 */
router.get('/', async (req, res) => {
    try {
        const { search, status } = req.query;
        let sql = "SELECT * FROM customers WHERE 1=1";
        const params = [];
        if (search) {
            sql += " AND (name LIKE ? OR email LIKE ?)";
            params.push(`%${search}%`, `%${search}%`);
        }
        if (status) {
            sql += " AND status = ?";
            params.push(status);
        }
        sql += " ORDER BY created_at DESC";
        const [rows] = await pool.query(sql, params);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * GET /api/customers/:id  -> include bookings
 */
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const [[customer]] = await pool.query("SELECT * FROM customers WHERE id = ?", [id]);
        if (!customer) return res.status(404).json({ error: 'Customer not found' });

        const [bookings] = await pool.query(
            `SELECT b.*, r.room_number, r.type as room_type
             FROM bookings b
                      JOIN rooms r ON b.room_id = r.id
             WHERE b.customer_id = ?
             ORDER BY b.start_date DESC`, [id]
        );
        customer.bookings = bookings;
        res.json(customer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * POST /api/customers
 */
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, note } = req.body;
        const [result] = await pool.query(
            "INSERT INTO customers (name, email, phone, note) VALUES (?,?,?,?)",
            [name, email || null, phone || null, note || null]
        );
        const [rows] = await pool.query("SELECT * FROM customers WHERE id = ?", [result.insertId]);
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * PUT /api/customers/:id
 */
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { name, email, phone, note, status } = req.body;
        await pool.query(
            "UPDATE customers SET name=?, email=?, phone=?, note=?, status=? WHERE id=?",
            [name, email || null, phone || null, note || null, status || null, id]
        );
        const [[row]] = await pool.query("SELECT * FROM customers WHERE id = ?", [id]);
        res.json(row);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * DELETE /api/customers/:id
 */
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await pool.query("DELETE FROM customers WHERE id = ?", [id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
