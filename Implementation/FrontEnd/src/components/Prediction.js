import React, { useState, useEffect } from 'react';

const Prediction = () => {
    const [forecasts, setForecasts] = useState([]);
    const [allIncidents, setAllIncidents] = useState([]); // Store all DB records
    const [selectedDept, setSelectedDept] = useState(null); // Track clicked dept
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch AI Forecasts
                const aiRes = await fetch('http://localhost:5000/api/ai-forecast');
                const aiData = await aiRes.json();
                setForecasts(aiData);

                // Fetch All Historical Incidents from DB
                const dbRes = await fetch('http://localhost:5000/api/incidents');
                const dbData = await dbRes.json();
                setAllIncidents(dbData);

                setLoading(false);
            } catch (err) {
                console.error("Data Fetch Error:", err);
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>🤖 AI is analyzing historical patterns...</div>;

    // Filter incidents for the selected department
    const filteredIncidents = allIncidents.filter(inc => inc.department === selectedDept);

    return (
        <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial' }}>
            <header style={{ marginBottom: '40px', borderBottom: '2px solid #d4af37', paddingBottom: '10px' }}>
                <h1 style={{ color: '#1a2a3a', margin: 0 }}>SafeSight AI: Predictive Risk Engine</h1>
                <p style={{ color: '#7f8c8d' }}>Random Forest Classifier Analysis | Click a card to view historical data</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
                {forecasts.map((item, index) => (
                    <div 
                        key={index} 
                        onClick={() => setSelectedDept(item.department)} // CLICK TRIGGER
                        style={cardStyle(item.predicted_severity)}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, color: '#2c3e50' }}>{item.department}</h3>
                            <span style={riskBadgeStyle(item.predicted_severity)}>
                                {item.predicted_severity} Risk
                            </span>
                        </div>

                        <div style={{ margin: '20px 0' }}>
                            <div style={{ fontSize: '12px', color: '#95a5a6', marginBottom: '5px' }}>RISK PROBABILITY</div>
                            <div style={progressContainer}>
                                <div style={progressBarStyle(item.risk_probability, item.predicted_severity)}></div>
                            </div>
                            <div style={{ textAlign: 'right', fontSize: '14px', fontWeight: 'bold', marginTop: '5px' }}>{item.risk_probability}</div>
                        </div>

                        <div style={actionBoxStyle}>
                            <strong style={{ color: '#1a2a3a' }}>Prescriptive Action:</strong><br/>
                            <p style={{ margin: '5px 0 0 0', fontStyle: 'italic', color: '#34495e' }}>{item.recommendation}</p>
                        </div>
                        
                        <div style={{marginTop: '15px', textAlign: 'center', fontSize: '11px', color: '#3498db', fontWeight: 'bold'}}>
                            🔍 VIEW HISTORICAL LOGS
                        </div>
                    </div>
                ))}
            </div>

            {/* --- DRILL DOWN MODAL --- */}
            {selectedDept && (
                <div style={modalOverlay}>
                    <div style={modalContent}>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
                            <h2>History: {selectedDept}</h2>
                            <button onClick={() => setSelectedDept(null)} style={closeBtn}>Close</button>
                        </div>
                        
                        <div style={{maxHeight: '400px', overflowY: 'auto'}}>
                            <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '13px'}}>
                                <thead>
                                    <tr style={{background: '#f4f7f6', textAlign: 'left'}}>
                                        <th style={thStyle}>ID</th>
                                        <th style={thStyle}>Type</th>
                                        <th style={thStyle}>Severity</th>
                                        <th style={thStyle}>Date</th>
                                        <th style={thStyle}>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredIncidents.length > 0 ? filteredIncidents.map((inc, i) => (
                                        <tr key={i} style={{borderBottom: '1px solid #eee'}}>
                                            <td style={tdStyle}>#S-{inc.incident_id}</td>
                                            <td style={tdStyle}>{inc.incident_type}</td>
                                            <td style={{...tdStyle, color: inc.severity === 'Critical' ? 'red' : 'orange', fontWeight: 'bold'}}>{inc.severity}</td>
                                            <td style={tdStyle}>{new Date(inc.incident_datetime).toLocaleDateString()}</td>
                                            <td style={tdStyle}>{inc.description}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="5" style={{padding: '20px', textAlign: 'center'}}>No historical records found for this department.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Styles ---
const cardStyle = (sev) => ({
    background: '#fff',
    borderRadius: '15px',
    padding: '20px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
    borderTop: `6px solid ${sev === 'Critical' ? '#e74c3c' : '#f1c40f'}`,
    cursor: 'pointer',
    transition: 'transform 0.2s',
    ':hover': { transform: 'translateY(-5px)' }
});

const riskBadgeStyle = (sev) => ({
    padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
    background: sev === 'Critical' ? '#fdecea' : '#fff9db',
    color: sev === 'Critical' ? '#e74c3c' : '#f08c00'
});

const progressContainer = { height: '12px', background: '#ecf0f1', borderRadius: '10px', overflow: 'hidden' };
const progressBarStyle = (prob, sev) => ({
    width: prob, height: '100%', 
    background: `linear-gradient(90deg, #d4af37, ${sev === 'Critical' ? '#e74c3c' : '#f39c12'})`,
    transition: 'width 1s ease-in-out'
});

const actionBoxStyle = { background: '#f8f9fa', padding: '15px', borderRadius: '10px', fontSize: '14px' };

const modalOverlay = {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
};

const modalContent = {
    background: '#fff', padding: '30px', borderRadius: '15px', width: '80%', maxWidth: '900px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
};

const closeBtn = { background: '#e74c3c', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' };
const thStyle = { padding: '12px', borderBottom: '2px solid #ddd' };
const tdStyle = { padding: '10px' };

export default Prediction;