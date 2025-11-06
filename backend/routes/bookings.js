// location: backend/src/routes/bookings.js

const express = require('express');
const pool = require('../db');
const router = express.Router();

/**
 * GET /api/bookings  -> list all bookings (optionally filter by status)
 */
router.get('/', async (req, res) => {
    try {
        const { status } = req.query;
        let sql = `SELECT b.*, c.name as customer_name, r.room_number FROM bookings b
               JOIN customers c on b.customer_id = c.id
               JOIN rooms r on b.room_id = r.id WHERE 1=1`;
        const params = [];
        if (status) {
            sql += " AND b.status = ?";
            params.push(status);
        }
        sql += " ORDER BY b.start_date DESC";
        const [rows] = await pool.query(sql, params);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * POST /api/bookings  -> create booking (also updates room.status and customer.status)
 * body: { customer: { id or name,email,phone }, room_id, start_date, end_date }
 */
router.post('/', async (req, res) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const { customer, room_id, start_date, end_date } = req.body;

        // If customer contains id -> use it, else create a new customer
        let customerId;
        if (customer && customer.id) {
            customerId = customer.id;
        } else {
            const [r] = await conn.query(
                "INSERT INTO customers (name, email, phone, status) VALUES (?,?,?,?)",
                [customer.name, customer.email || null, customer.phone || null, 'booked']
            );
            customerId = r.insertId;
        }

        // check room availability
        const [[room]] = await conn.query("SELECT * FROM rooms WHERE id = ?", [room_id]);
        if (!room) {
            await conn.rollback();
            return res.status(400).json({ error: 'Room not found' });
        }
        if (room.status === 'maintenance' || room.status === 'occupied') {
            await conn.rollback();
            return res.status(400).json({ error: 'Room not available for booking' });
        }

        // create booking
        const [b] = await conn.query(
            "INSERT INTO bookings (customer_id, room_id, start_date, end_date, status) VALUES (?,?,?,?,?)",
            [customerId, room_id, start_date, end_date, 'booked']
        );

        // set room status to 'booked'
        await conn.query("UPDATE rooms SET status = 'booked' WHERE id = ?", [room_id]);

        // set customer status
        await conn.query("UPDATE customers SET status = 'booked' WHERE id = ?", [customerId]);

        await conn.commit();

        const [[bookingRow]] = await pool.query("SELECT b.*, c.name as customer_name, r.room_number FROM bookings b JOIN customers c ON b.customer_id=c.id JOIN rooms r ON b.room_id=r.id WHERE b.id = ?", [b.insertId]);
        res.json(bookingRow);

    } catch (err) {
        await conn.rollback();
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    } finally {
        conn.release();
    }
});

/**
 * POST /api/bookings/:id/checkin  -> mark as staying
 */
router.post('/:id/checkin', async (req, res) => {
    const id = req.params.id;
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        // get booking
        const [[booking]] = await conn.query("SELECT * FROM bookings WHERE id = ?", [id]);
        if (!booking) { await conn.rollback(); return res.status(404).json({ error: 'Booking not found' }); }

        // update booking status
        await conn.query("UPDATE bookings SET status='staying' WHERE id = ?", [id]);

        // update room status to occupied
        await conn.query("UPDATE rooms SET status='occupied' WHERE id = ?", [booking.room_id]);

        // update customer status
        await conn.query("UPDATE customers SET status='staying' WHERE id = ?", [booking.customer_id]);

        await conn.commit();
        res.json({ success: true });
    } catch (err) {
        await conn.rollback();
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    } finally {
        conn.release();
    }
});

/**
 * POST /api/bookings/:id/checkout  -> mark as checked-out
 */
router.post('/:id/checkout', async (req, res) => {
    const id = req.params.id;
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const [[booking]] = await conn.query("SELECT * FROM bookings WHERE id = ?", [id]);
        if (!booking) { await conn.rollback(); return res.status(404).json({ error: 'Booking not found' }); }

        await conn.query("UPDATE bookings SET status='checked-out' WHERE id = ?", [id]);
        // update room back to available
        await conn.query("UPDATE rooms SET status='available' WHERE id = ?", [booking.room_id]);
        // update customer status
        await conn.query("UPDATE customers SET status='checked-out' WHERE id = ?", [booking.customer_id]);

        await conn.commit();
        res.json({ success: true });
    } catch (err) {
        await conn.rollback();
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    } finally {
        conn.release();
    }
});

module.exports = router;
