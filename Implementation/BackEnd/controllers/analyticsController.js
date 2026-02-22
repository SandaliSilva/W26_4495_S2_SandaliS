const db = require('../config/db');

exports.getDashboardStats = async (req, res) => {
    try {
        // KPI Totals
        const [kpiRows] = await db.query(`
            SELECT 
                COUNT(*) as totalIncidents,
                SUM(CASE WHEN severity IN ('High', 'Critical') THEN 1 ELSE 0 END) as criticalRisks,
                SUM(hospitalized) as hospitalization
            FROM incidents
        `);

        // Severity Distribution (Pie Chart)
        const [severityRows] = await db.query(`
            SELECT severity as name, COUNT(*) as value 
            FROM incidents 
            GROUP BY severity
        `);

        // Monthly Trend (Area/Line Chart) - Labels: 'month' and 'incidents'
        const [trendRows] = await db.query(`
            SELECT DATE_FORMAT(incident_datetime, '%b') as month, COUNT(*) as incidents 
            FROM incidents 
            GROUP BY month 
            ORDER BY FIELD(month, 'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec')
        `);

        // Department Data (Bar Chart)
        const [deptRows] = await db.query(`
            SELECT department as name, COUNT(*) as value 
            FROM incidents 
            GROUP BY department 
            ORDER BY value DESC
        `);

        res.status(200).json({
            stats: kpiRows[0],
            severityData: severityRows,
            trendData: trendRows,
            departmentData: deptRows
        });

    } catch (error) {
        console.error("SQL Error:", error.message);
        res.status(500).json({ error: "Database query failed" });
    }
};