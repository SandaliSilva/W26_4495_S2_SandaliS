const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Database connection details
// This connects the Application Layer to MySQL Data Layer
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '@Umnotinto23', 
    database: 'safesight_db'
});

// 2. Establish the connection
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to SafeSight MySQL Database.');
});

// 3. Basic "Health Check" Route
// Confirms the server is alive when visiting http://localhost:5000/
app.get('/', (req, res) => {
    res.send('SafeSight Backend is running!');
});

// 4. Incident Data Route (New)
// This will fetch the incident logs from MySQL for React Dashboards
app.get('/api/incidents', (req, res) => {
    //  incident_id to match the specific SQL schema
    const sqlQuery = 'SELECT * FROM incidents ORDER BY incident_id DESC';
    
    db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
});

// Add a new incident to the database
app.post('/api/incidents', (req, res) => {
    const { department, incident_type, severity, status } = req.body;
    const sql = "INSERT INTO incidents (department, incident_type, severity, status) VALUES (?, ?, ?, ?)";
    
    db.query(sql, [department, incident_type, severity, status], (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ message: "Incident reported successfully!", id: result.insertId });
    });
});

// 5. Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});