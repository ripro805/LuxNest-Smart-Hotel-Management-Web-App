// location: backend/src/routes/rooms.js

const express = require('express');
const pool = require('../db');
const router = express.Router();

/**
 * GET /api/rooms?search=&filter(status/type)=
 */
router.get('/', async (req, res) => {
    try {
        const { search, status, type } = req.query;
        let sql = "SELECT * FROM rooms WHERE 1=1";
        const params = [];
        if (search) {
            sql += " AND (room_number LIKE ? OR notes LIKE ?)";
            params.push(`%${search}%`, `%${search}%`);
        }
        if (status) {
            sql += " AND status = ?";
            params.push(status);
        }
        if (type) {
            sql += " AND type = ?";
            params.push(type);
        }
        sql += " ORDER BY room_number ASC";
        const [rows] = await pool.query(sql, params);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const [[room]] = await pool.query("SELECT * FROM rooms WHERE id = ?", [id]);
        if (!room) return res.status(404).json({ error: 'Room not found' });

        const [bookings] = await pool.query(
            `SELECT b.*, c.name as customer_name, c.email as customer_email
       FROM bookings b
       LEFT JOIN customers c on b.customer_id = c.id
       WHERE b.room_id = ? ORDER BY b.start_date DESC`, [id]
        );
        room.bookings = bookings;
        res.json(room);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { room_number, type, status, price, notes } = req.body;
        const [result] = await pool.query(
            "INSERT INTO rooms (room_number, type, status, price, notes) VALUES (?,?,?,?,?)",
            [room_number, type || 'single', status || 'available', price || 0.0, notes || null]
        );
        const [[row]] = await pool.query("SELECT * FROM rooms WHERE id = ?", [result.insertId]);
        res.json(row);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { room_number, type, status, price, notes } = req.body;
        const id = req.params.id;
        await pool.query(
            "UPDATE rooms SET room_number=?, type=?, status=?, price=?, notes=? WHERE id=?",
            [room_number, type || 'single', status || 'available', price || 0.0, notes || null, id]
        );
        const [[row]] = await pool.query("SELECT * FROM rooms WHERE id = ?", [id]);
        res.json(row);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await pool.query("DELETE FROM rooms WHERE id = ?", [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
