

//old staffs.js
// const express = require('express');
// const pool = require('../db');
// const router = express.Router();
//
// /**
//  * GET /api/staffs?search=&designation=
//  */
// router.get('/', async (req, res) => {
//     try {
//         const { search, designation } = req.query;
//         let sql = "SELECT * FROM staffs WHERE 1=1";
//         const params = [];
//         if (search) {
//             sql += " AND (name LIKE ? OR email LIKE ?)";
//             params.push(`%${search}%`, `%${search}%`);
//         }
//         if (designation) {
//             sql += " AND designation = ?";
//             params.push(designation);
//         }
//         const [rows] = await pool.query(sql, params);
//         res.json(rows);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Server error' });
//     }
// });
//
// router.post('/', async (req, res) => {
//     try {
//         const { name, email, phone, designation, joined_at } = req.body;
//         const [result] = await pool.query(
//             "INSERT INTO staffs (name, email, phone, designation, joined_at) VALUES (?,?,?,?,?)",
//             [name, email || null, phone || null, designation || 'staff', joined_at || null]
//         );
//         const [[row]] = await pool.query("SELECT * FROM staffs WHERE id = ?", [result.insertId]);
//         res.json(row);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Server error' });
//     }
// });
//
// router.put('/:id', async (req, res) => {
//     try {
//         const { name, email, phone, designation, joined_at } = req.body;
//         const id = req.params.id;
//         await pool.query(
//             "UPDATE staffs SET name=?, email=?, phone=?, designation=?, joined_at=? WHERE id=?",
//             [name, email || null, phone || null, designation || 'staff', joined_at || null, id]
//         );
//         const [[row]] = await pool.query("SELECT * FROM staffs WHERE id = ?", [id]);
//         res.json(row);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Server error' });
//     }
// });
//
// router.delete('/:id', async (req, res) => {
//     try {
//         await pool.query("DELETE FROM staffs WHERE id = ?", [req.params.id]);
//         res.json({ success: true });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Server error' });
//     }
// });
//
// module.exports = router;
