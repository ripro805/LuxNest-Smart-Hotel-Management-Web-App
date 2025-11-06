const express = require('express');
const pool = require('../db.js');
const router = express.Router();
/**
 * GET /api/staffs
 * সব staff list করবে
 */
router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM staffs ORDER BY created_at DESC");
        res.json(rows);
    } catch (err) {
        console.error("Error fetching staffs:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

/**
 * POST /api/staffs
 * নতুন staff add করবে
 */
router.post("/", async (req, res) => {
    try {
        const { name, email, phone, designation, joined_at } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Name is required" });
        }

        const [result] = await pool.query(
            "INSERT INTO staffs (name, email, phone, designation, joined_at) VALUES (?, ?, ?, ?, ?)",
            [name, email, phone, designation || "staff", joined_at || new Date()]
        );

        const [newStaff] = await pool.query("SELECT * FROM staffs WHERE id = ?", [result.insertId]);
        res.status(201).json(newStaff[0]);
    } catch (err) {
        console.error("Error creating staff:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

/**
 * PUT /api/staffs/:id
 * staff edit/update করবে
 */
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, designation, joined_at } = req.body;

        const [result] = await pool.query(
            "UPDATE staffs SET name=?, email=?, phone=?, designation=?, joined_at=? WHERE id=?",
            [name, email, phone, designation, joined_at, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Staff not found" });
        }

        const [updatedStaff] = await pool.query("SELECT * FROM staffs WHERE id = ?", [id]);
        res.json(updatedStaff[0]);
    } catch (err) {
        console.error("Error updating staff:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

/**
 * DELETE /api/staffs/:id
 * staff delete করবে
 */
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query("DELETE FROM staffs WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Staff not found" });
        }

        res.json({ message: "Staff deleted successfully" });
    } catch (err) {
        console.error("Error deleting staff:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
