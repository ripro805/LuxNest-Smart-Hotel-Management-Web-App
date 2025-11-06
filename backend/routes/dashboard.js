//location: backend/src/routes/dashboard.js

const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // total rooms
        const [[{ total_rooms }]] = await pool.query("SELECT COUNT(*) AS total_rooms FROM rooms");
        // available
        const [[{ available_rooms }]] = await pool.query("SELECT COUNT(*) AS available_rooms FROM rooms WHERE status='available'");
        // booked
        const [[{ booked_rooms }]] = await pool.query("SELECT COUNT(*) AS booked_rooms FROM rooms WHERE status='booked'");
        // occupied
        const [[{ occupied_rooms }]] = await pool.query("SELECT COUNT(*) AS occupied_rooms FROM rooms WHERE status='occupied'");
        // currently staying customers
        const [[{ staying_customers }]] = await pool.query("SELECT COUNT(DISTINCT customer_id) AS staying_customers FROM bookings WHERE status='staying'");
        // total customers
        const [[{ total_customers }]] = await pool.query("SELECT COUNT(*) AS total_customers FROM customers");

        res.json({
            total_rooms,
            available_rooms,
            booked_rooms,
            occupied_rooms,
            staying_customers,
            total_customers
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
