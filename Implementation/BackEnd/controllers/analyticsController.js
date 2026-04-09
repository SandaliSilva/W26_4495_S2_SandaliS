const db = require('../config/db');

exports.getDashboardStats = async (req, res) => {
    try {
        // 1. KPI Totals
        const [kpiRows] = await db.query(`
            SELECT 
                COUNT(*) as totalIncidents,
                SUM(CASE WHEN severity IN ('High', 'Critical') THEN 1 ELSE 0 END) as criticalRisks,
                SUM(hospitalized) as hospitalization
            FROM incidents
        `);

        // 2. Severity Distribution
        const [severityRows] = await db.query(`
            SELECT severity as name, COUNT(*) as value 
            FROM incidents 
            GROUP BY severity
        `);

        // 3. Monthly Trend
        const [trendRows] = await db.query(`
            SELECT DATE_FORMAT(incident_datetime, '%b') as month, COUNT(*) as incidents 
            FROM incidents 
            GROUP BY month 
            ORDER BY FIELD(month, 'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec')
        `);

        // 4. Department Data
        const [deptRows] = await db.query(`
            SELECT department as name, COUNT(*) as value 
            FROM incidents 
            GROUP BY department 
            ORDER BY value DESC
        `);

        // --- NEW SECTION: FETCH RECENT INCIDENTS FOR THE TABLE & HOVER ---
        // We include all columns needed for the hover: work_area, shift, description, etc.
        const [recentIncidents] = await db.query(`
            SELECT 
                incident_id, 
                department, 
                work_area, 
                shift, 
                incident_type, 
                severity, 
                description, 
                ppe_worn,
                status
            FROM incidents 
            WHERE status != 'Resolved' 
            ORDER BY incident_datetime DESC
        `);

        res.status(200).json({
            stats: kpiRows[0],
            severityData: severityRows,
            trendData: trendRows,
            departmentData: deptRows,
            recentIncidents: recentIncidents // Now the frontend will receive the actual list!
        });

    } catch (error) {
        console.error("SQL Error:", error.message);
        res.status(500).json({ error: "Database query failed" });
    }
};