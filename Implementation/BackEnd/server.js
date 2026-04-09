const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const axios = require('axios'); 
const { generateWSBCReport } = require('./controllers/reportController');
const ExcelJS = require('exceljs');

const app = express();

app.use(cors());
app.use(express.json());

// --- Database Connection ---
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '@Umnotinto23', 
    database: 'safesight_db'
}).promise(); 

// --- 1. Incident Logging Route ---
app.post('/api/incidents', async (req, res) => {
    const { 
        department, work_area, shift, incident_datetime, 
        incident_type, description, severity, root_cause, 
        ppe_worn, hospitalized, status 
    } = req.body;

    const sql = `INSERT INTO incidents 
        (department, work_area, shift, incident_datetime, incident_type, description, severity, root_cause, ppe_worn, hospitalized, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [department, work_area, shift, incident_datetime, incident_type, description, severity, root_cause, ppe_worn, hospitalized, status || 'Open'];

    try {
        const [result] = await db.query(sql, values);
        res.status(201).json({ message: "Incident logged successfully", id: result.insertId });
    } catch (err) {
        console.error("❌ Database Error:", err);
        res.status(500).json({ message: "Database insertion failed", error: err });
    }
});

// --- 2. Full Dashboard Stats Route (UPDATED FOR ADVANCED CHARTS) ---
app.get('/api/dashboard-stats', async (req, res) => {
    try {
        // Query A: KPI Summary
        const summaryQuery = `
            SELECT 
                COUNT(*) as totalIncidents,
                SUM(CASE WHEN severity IN ('Critical', 'High') THEN 1 ELSE 0 END) as criticalRisks,
                SUM(CASE WHEN hospitalized = 1 THEN 1 ELSE 0 END) as hospitalization
            FROM incidents`;

        // Query B: Severity Mix (Pie Chart)
        const severityQuery = `SELECT severity as name, COUNT(*) as value FROM incidents GROUP BY severity`;
        
        // Query C: ADVANCED Department Breakdown (Stacked Bar, Radar, Scatter)
        const departmentQuery = `
            SELECT 
                department as name, 
                SUM(CASE WHEN severity = 'Critical' THEN 1 ELSE 0 END) as Critical,
                SUM(CASE WHEN severity = 'High' THEN 1 ELSE 0 END) as High,
                SUM(CASE WHEN severity IN ('Medium', 'Low') THEN 1 ELSE 0 END) as Low,
                COUNT(*) as total
            FROM incidents 
            GROUP BY department`;
        
        // Query D: Trends over time (Area Chart)
        const trendQuery = `
            SELECT 
                DATE_FORMAT(incident_datetime, '%b') as name, 
                COUNT(*) as value 
            FROM incidents 
            GROUP BY name, MONTH(incident_datetime)
            ORDER BY MONTH(incident_datetime) ASC`;

        // Query E: Recent Observations (Expanded to 15 for Operational View)
        // Query E: Recent Observations (FIXED for Hover Tooltips)
        const recentQuery = `
            SELECT 
                incident_id, department, work_area, shift, 
                incident_type, severity, status, description, ppe_worn 
            FROM incidents 
            ORDER BY incident_datetime DESC 
            LIMIT 15`;

        // Execute all queries in parallel for speed
        const [
            [[summary]], 
            [severityData], 
            [deptData], 
            [trendData], 
            [recentIncidents]
        ] = await Promise.all([
            db.query(summaryQuery),
            db.query(severityQuery),
            db.query(departmentQuery),
            db.query(trendQuery),
            db.query(recentQuery)
        ]);

        res.json({
            stats: {
                totalIncidents: summary.totalIncidents || 0,
                criticalRisks: summary.criticalRisks || 0,
                hospitalization: summary.hospitalization || 0
            },
            severityData: severityData || [],
            departmentData: deptData || [], // Now contains Critical/High/Low keys
            trendData: trendData || [],
            recentIncidents: recentIncidents || []
        });

    } catch (err) {
        console.error("❌ Dashboard Data Error:", err);
        res.status(500).json({ error: "Failed to fetch dashboard statistics" });
    }
});

// --- 3. AI PREDICTION BRIDGE ---
app.get('/api/ai-forecast', async (req, res) => {
    try {
        const response = await axios.get('http://127.0.0.1:5001/ai/predict-risk');
        res.json(response.data);
    } catch (error) {
        console.error("AI Engine Offline");
        res.status(500).json({ error: "Predictive engine is offline." });
    }
});

// --- 4. Get All Incidents (List View) ---
app.get('/api/incidents', async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM incidents ORDER BY incident_datetime DESC");
        res.json(results);
    } catch (err) {
        res.status(500).json(err);
    }
});

// --- 5. PDF Report Generation ---
app.get('/api/reports/generate/:id', (req, res, next) => {
    req.db = db; 
    next();
}, generateWSBCReport);

// --- 6. Excel Export Route ---
app.get('/api/reports/export-excel', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM incidents ORDER BY incident_datetime DESC");

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Incident Report');

        worksheet.columns = [
            { header: 'ID', key: 'incident_id', width: 10 },
            { header: 'Department', key: 'department', width: 20 },
            { header: 'Area', key: 'work_area', width: 20 },
            { header: 'Date', key: 'incident_datetime', width: 25 },
            { header: 'Type', key: 'incident_type', width: 20 },
            { header: 'Severity', key: 'severity', width: 15 },
            { header: 'Root Cause', key: 'root_cause', width: 30 },
            { header: 'PPE Worn', key: 'ppe_worn', width: 12 },
            { header: 'Hospitalized', key: 'hospitalized', width: 15 },
            { header: 'Status', key: 'status', width: 15 }
        ];

        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true, color: { argb: 'FFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1A2A3A' } };
        });

        rows.forEach(incident => {
            worksheet.addRow({
                ...incident,
                ppe_worn: incident.ppe_worn ? 'Yes' : 'No',
                hospitalized: incident.hospitalized ? 'Yes' : 'No',
                incident_datetime: new Date(incident.incident_datetime).toLocaleString()
            });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=SafeSight_Data_Export.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error("Excel Export Error:", error);
        res.status(500).send("Failed to export Excel file");
    }
});

// --- 7. Update Incident Status ---
// --- 7. Update Incident Status & Save HR Action (FIXED) ---
app.patch('/api/incidents/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status, hr_action } = req.body; // Pick up both from the frontend

    const sql = "UPDATE incidents SET status = ?, hr_action = ? WHERE incident_id = ?";
    
    try {
        // We pass status AND hr_action to the database
        await db.query(sql, [status, hr_action, id]);
        
        console.log(`✅ Incident #${id} updated: Status=${status}, Action=${hr_action}`);
        res.json({ message: `Incident #${id} resolved and action logged.` });
    } catch (err) {
        console.error("❌ Database Update Error:", err);
        res.status(500).json({ error: "Failed to update incident in database" });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 SafeSight Server running on port ${PORT}`));