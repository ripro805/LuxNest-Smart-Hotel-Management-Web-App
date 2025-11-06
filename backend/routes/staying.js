import { Router } from "express";
import pool from "../db.js";

const router = Router();

// Get all staying/booked customers
router.get("/", async (req, res) => {
    const [rows] = await pool.query("SELECT * FROM bookings");
    res.json(rows);
});

// Check-in
router.put("/:id/checkin", async (req, res) => {
    const { id } = req.params;
    await pool.query("UPDATE bookings SET status='staying' WHERE id=?", [id]);
    const [[booking]] = await pool.query("SELECT roomId FROM bookings WHERE id=?", [id]);
    await pool.query("UPDATE rooms SET status='booked' WHERE id=?", [booking.roomId]);
    res.json({ message: "Checked in" });
});

// Check-out
router.put("/:id/checkout", async (req, res) => {
    const { id } = req.params;
    await pool.query("UPDATE bookings SET status='checkedout' WHERE id=?", [id]);
    const [[booking]] = await pool.query("SELECT roomId FROM bookings WHERE id=?", [id]);
    await pool.query("UPDATE rooms SET status='empty' WHERE id=?", [booking.roomId]);
    res.json({ message: "Checked out" });
});

export default router;
