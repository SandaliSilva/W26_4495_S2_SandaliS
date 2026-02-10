const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection details
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '@Umnotinto23',
    database: 'safesight_db'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to SafeSight MySQL Database.');
});

app.get('/', (req, res) => {
    res.send('SafeSight Backend is running!');
});

app.listen(5000, () => {
    console.log('Server started on port 5000');
});