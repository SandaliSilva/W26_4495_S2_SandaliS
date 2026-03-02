const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const axios = require('axios'); // <--- 1. Make sure to import axios

const app = express();

app.use(cors());
app.use(express.json());

// --- Database Connection ---
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '@Umnotinto23', 
    database: 'safesight_db'
});

// --- 1. Incident Logging Route ---
app.post('/api/incidents', (req, res) => {
    const { 
        department, work_area, shift, incident_datetime, 
        incident_type, description, severity, root_cause, 
        ppe_worn, hospitalized, status 
    } = req.body;

    const sql = `INSERT INTO incidents 
        (department, work_area, shift, incident_datetime, incident_type, description, severity, root_cause, ppe_worn, hospitalized, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [department, work_area, shift, incident_datetime, incident_type, description, severity, root_cause, ppe_worn, hospitalized, status || 'Open'];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("❌ Database Error:", err);
            return res.status(500).json({ message: "Database insertion failed", error: err });
        }
        res.status(201).json({ message: "Incident logged successfully", id: result.insertId });
    });
});

// --- 2. Full Dashboard Stats Route ---
app.get('/api/dashboard-stats', (req, res) => {
    const summaryQuery = `
        SELECT 
            COUNT(*) as totalIncidents,
            SUM(CASE WHEN severity IN ('Critical', 'High') THEN 1 ELSE 0 END) as criticalRisks,
            SUM(CASE WHEN hospitalized = 1 THEN 1 ELSE 0 END) as hospitalization
        FROM incidents`;

    const severityQuery = `SELECT severity as name, COUNT(*) as value FROM incidents GROUP BY severity`;
    const departmentQuery = `SELECT department as name, COUNT(*) as value FROM incidents GROUP BY department`;
    
    const trendQuery = `
        SELECT 
            DATE_FORMAT(incident_datetime, '%b') as name, 
            COUNT(*) as value 
        FROM incidents 
        GROUP BY name, MONTH(incident_datetime)
        ORDER BY MONTH(incident_datetime) ASC`;

    db.query(summaryQuery, (err, summary) => {
        db.query(severityQuery, (err, severityData) => {
            db.query(departmentQuery, (err, deptData) => {
                db.query(trendQuery, (err, trendData) => {
                    res.json({
                        stats: {
                            totalIncidents: summary[0].totalIncidents || 0,
                            criticalRisks: summary[0].criticalRisks || 0,
                            hospitalization: summary[0].hospitalization || 0
                        },
                        severityData: severityData || [],
                        departmentData: deptData || [],
                        trendData: trendData || []
                    });
                });
            });
        });
    });
});

// --- 3. AI PREDICTION BRIDGE ---
// This route talks to your Python Flask server (Port 5001)
app.get('/api/ai-forecast', async (req, res) => {
    try {
        // We call the Python AI Service we built earlier
        const response = await axios.get('http://127.0.0.1:5001/ai/predict-risk');
        res.json(response.data);
    } catch (error) {
        console.error("❌ AI Service Error:", error.message);
        res.status(500).json({ error: "Predictive engine is offline. Make sure predict.py is running!" });
    }
});

// --- 4. Test Route ---
app.get('/', (req, res) => res.send('SafeSight Backend is running!'));

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 SafeSight Server running on port ${PORT}`));

// const express = require('express');
// const cors = require('cors');
// const mysql = require('mysql2');

// const app = express();

// app.use(cors());
// app.use(express.json());

// // --- Database Connection ---
// const db = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: '@Umnotinto23', 
//     database: 'safesight_db'
// });

// // --- 1. Incident Logging Route ---
// app.post('/api/incidents', (req, res) => {
//     const { 
//         department, work_area, shift, incident_datetime, 
//         incident_type, description, severity, root_cause, 
//         ppe_worn, hospitalized, status 
//     } = req.body;

//     const sql = `INSERT INTO incidents 
//         (department, work_area, shift, incident_datetime, incident_type, description, severity, root_cause, ppe_worn, hospitalized, status) 
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

//     const values = [department, work_area, shift, incident_datetime, incident_type, description, severity, root_cause, ppe_worn, hospitalized, status || 'Open'];

//     db.query(sql, values, (err, result) => {
//         if (err) {
//             console.error("❌ Database Error:", err);
//             return res.status(500).json({ message: "Database insertion failed", error: err });
//         }
//         res.status(201).json({ message: "Incident logged successfully", id: result.insertId });
//     });
// });

// // --- 2. Full Dashboard Stats Route ---
// app.get('/api/dashboard-stats', (req, res) => {
//     const summaryQuery = `
//         SELECT 
//             COUNT(*) as totalIncidents,
//             SUM(CASE WHEN severity IN ('Critical', 'High') THEN 1 ELSE 0 END) as criticalRisks,
//             SUM(CASE WHEN hospitalized = 1 THEN 1 ELSE 0 END) as hospitalization
//         FROM incidents`;

//     const severityQuery = `SELECT severity as name, COUNT(*) as value FROM incidents GROUP BY severity`;
//     const departmentQuery = `SELECT department as name, COUNT(*) as value FROM incidents GROUP BY department`;
    
//     // NEW: Query for Trend (Grouping by Month)
//     const trendQuery = `
//         SELECT 
//             DATE_FORMAT(incident_datetime, '%b') as name, 
//             COUNT(*) as value 
//         FROM incidents 
//         GROUP BY name, MONTH(incident_datetime)
//         ORDER BY MONTH(incident_datetime) ASC`;

//     db.query(summaryQuery, (err, summary) => {
//         db.query(severityQuery, (err, severityData) => {
//             db.query(departmentQuery, (err, deptData) => {
//                 db.query(trendQuery, (err, trendData) => {
//                     res.json({
//                         stats: {
//                             totalIncidents: summary[0].totalIncidents || 0,
//                             criticalRisks: summary[0].criticalRisks || 0,
//                             hospitalization: summary[0].hospitalization || 0
//                         },
//                         severityData: severityData || [],
//                         departmentData: deptData || [],
//                         trendData: trendData || [] // Now this has data!
//                     });
//                 });
//             });
//         });
//     });
// });

// // --- 3. Test Route ---
// app.get('/', (req, res) => res.send('SafeSight Backend is running!'));

// const PORT = 5000;
// app.listen(PORT, () => console.log(`🚀 SafeSight Server running on port ${PORT}`));