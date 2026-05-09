const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files from 'public' directory

// Database Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// --- API ROUTES ---

// 1. Get all students
app.get('/api/students', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM students');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// 2. Get a specific student by USN
app.get('/api/students/:usn', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM students WHERE usn = ?', [req.params.usn]);
        if (rows.length === 0) return res.status(404).json({ error: 'Student not found' });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// 3. Add a new student
app.post('/api/students', async (req, res) => {
    const { usn, name, semester, section } = req.body;
    try {
        await pool.query('INSERT INTO students (usn, name, semester, section) VALUES (?, ?, ?, ?)', 
            [usn, name, semester, section]);
        res.status(201).json({ message: 'Student added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error or duplicate USN' });
    }
});

// 4. Update a student
app.put('/api/students/:usn', async (req, res) => {
    const { name, semester, section } = req.body;
    try {
        const [result] = await pool.query('UPDATE students SET name=?, semester=?, section=? WHERE usn=?', 
            [name, semester, section, req.params.usn]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Student not found' });
        res.json({ message: 'Student updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// 5. Delete a student
app.delete('/api/students/:usn', async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM students WHERE usn=?', [req.params.usn]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Student not found' });
        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// 6. Get all subjects
app.get('/api/subjects', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM subjects');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// 7. Get marks for a student for all subjects
app.get('/api/marks/:usn', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT m.*, s.code, s.name as subject_name 
            FROM marks m 
            JOIN subjects s ON m.subject_id = s.id 
            WHERE m.student_usn = ?
        `, [req.params.usn]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// 8. Update marks for a student and subject
app.post('/api/marks', async (req, res) => {
    const { student_usn, subject_id, cie_marks, la1_marks, la2_marks } = req.body;
    try {
        // Upsert logic (Insert or Update if exists)
        const [result] = await pool.query(`
            INSERT INTO marks (student_usn, subject_id, cie_marks, la1_marks, la2_marks)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE cie_marks=VALUES(cie_marks), la1_marks=VALUES(la1_marks), la2_marks=VALUES(la2_marks)
        `, [student_usn, subject_id, cie_marks, la1_marks, la2_marks]);
        res.json({ message: 'Marks updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
