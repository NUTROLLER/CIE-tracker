const mysql = require('mysql2/promise');

async function testConnection(password) {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: password
        });
        console.log(`Success with password: "${password}"`);
        
        // Setup Database
        await connection.query('CREATE DATABASE IF NOT EXISTS cie_tracker');
        await connection.query('USE cie_tracker');
        
        // Create tables
        await connection.query(`
            CREATE TABLE IF NOT EXISTS students (
                usn VARCHAR(20) PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                semester INT,
                section VARCHAR(10)
            )
        `);
        
        await connection.query(`
            CREATE TABLE IF NOT EXISTS subjects (
                id INT AUTO_INCREMENT PRIMARY KEY,
                code VARCHAR(20) NOT NULL,
                name VARCHAR(100) NOT NULL
            )
        `);
        
        await connection.query(`
            CREATE TABLE IF NOT EXISTS marks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_usn VARCHAR(20),
                subject_id INT,
                cie_marks INT DEFAULT 0,
                la1_marks INT DEFAULT 0,
                la2_marks INT DEFAULT 0,
                FOREIGN KEY (student_usn) REFERENCES students(usn) ON DELETE CASCADE,
                FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
                UNIQUE KEY unique_student_subject (student_usn, subject_id)
            )
        `);
        
        // Insert sample data based on Figma design
        await connection.query(`INSERT IGNORE INTO students (usn, name, semester, section) VALUES ('1NT19CS025', 'Arun', 5, 'CSE - B')`);
        
        await connection.query(`INSERT IGNORE INTO subjects (code, name) VALUES ('DAA', 'Design and Analysis of Algorithms'), ('DBMS', 'Database Management Systems'), ('MAT', 'Mathematics'), ('BIO', 'Biology')`);
        
        const [subjects] = await connection.query('SELECT * FROM subjects');
        
        for (const sub of subjects) {
            await connection.query(`
                INSERT IGNORE INTO marks (student_usn, subject_id, cie_marks, la1_marks, la2_marks) 
                VALUES ('1NT19CS025', ?, 47, 10, 10)
            `, [sub.id]);
        }
        
        console.log('Database schema and sample data setup successful.');
        await connection.end();
        return true;
    } catch (err) {
        console.error(`Failed with password: "${password}" - ${err.message}`);
        return false;
    }
}

async function run() {
    let success = await testConnection('');
    if (!success) {
        success = await testConnection('riyaMehul1');
    }
    if (!success) {
        console.log("Could not connect with either password.");
    }
}

run();
