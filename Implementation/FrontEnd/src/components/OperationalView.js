import React, { useState } from 'react';
import axios from 'axios';

const OperationalView = ({ data }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [severityFilter, setSeverityFilter] = useState('All');

    const handleResolve = async (id) => {
        try {
            await axios.patch(`http://localhost:5000/api/incidents/${id}/status`, { status: 'Resolved' });
            alert(`Incident #S-${id} Resolved!`);
            window.location.reload();
        } catch (err) {
            console.error("Update failed", err);
        }
    };

    // Advanced Filtering: Search + Severity Dropdown
    const filteredIncidents = data.recentIncidents.filter(inc => {
        const matchesSearch = inc.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             inc.incident_type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSeverity = severityFilter === 'All' || inc.severity === severityFilter;
        return matchesSearch && matchesSeverity;
    });

    return (
        <div style={{ animation: 'fadeIn 0.5s' }}>
            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
                <div style={kpiStyle}><h4>TOTAL LOGS</h4><p>{data.stats.totalIncidents}</p></div>
                <div style={kpiStyle}><h4>CRITICAL PENDING</h4><p style={{color: '#e74c3c'}}>{data.stats.criticalRisks}</p></div>
                <div style={kpiStyle}><h4>HOSPITALIZED</h4><p style={{color: '#3498db'}}>{data.stats.hospitalization}</p></div>
            </div>

            {/* Filter Bar */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                <input 
                    type="text" 
                    placeholder="Filter by Dept/Type..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={searchBarStyle}
                />
                <select 
                    value={severityFilter} 
                    onChange={(e) => setSeverityFilter(e.target.value)}
                    style={selectStyle}
                >
                    <option value="All">All Severities</option>
                    <option value="Critical">Critical Only</option>
                    <option value="High">High Only</option>
                    <option value="Stable">Stable Only</option>
                </select>
            </div>

            {/* Table */}
            <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginBottom: '15px', color: '#1a2a3a' }}>Active Safety Observations</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #f4f7f6', color: '#7f8c8d' }}>
                            <th style={{ padding: '12px' }}>ID</th>
                            <th>DEPT / TYPE</th>
                            <th>SEVERITY</th>
                            <th>INCIDENT DESCRIPTION</th>
                            <th>AI RECOMMENDATION</th>
                            <th>HR CORRECTIVE ACTION</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredIncidents.map((inc, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                <td style={{ padding: '12px', fontWeight: 'bold' }}>#S-{inc.incident_id}</td>
                                <td>
                                    <div style={{fontWeight: 'bold'}}>{inc.department}</div>
                                    <div style={{fontSize: '11px', color: '#95a5a6'}}>{inc.incident_type}</div>
                                </td>
                                <td>
                                    <span style={{ color: inc.severity === 'Critical' ? '#e74c3c' : '#f39c12', fontWeight: 'bold' }}>
                                        {inc.severity}
                                    </span>
                                </td>
                                <td style={{ maxWidth: '200px', padding: '10px' }}>{inc.description}</td>
                                
                                {/* AI ADVICE COLUMN */}
                                <td style={{ maxWidth: '200px' }}>
                                    <div style={aiAdviceStyle}>
                                        {getAIRecommendation(inc.severity, inc.incident_type)}
                                    </div>
                                </td>

                                {/* HR ONLY COLUMN */}
                                <td style={{ maxWidth: '200px' }}>
                                    <div style={hrActionStyle}>
                                        {inc.hr_action || "Awaiting HR Review"}
                                    </div>
                                </td>

                                <td>
                                    <button onClick={() => handleResolve(inc.incident_id)} style={btnStyle}>Resolve</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Simple Logic for AI Advice (Can be expanded)
const getAIRecommendation = (severity, type) => {
    if (severity === 'Critical') return "⚠️ Immediate evacuation and medical response required.";
    if (type.includes('Slip')) return "💡 Deploy 'Wet Floor' signage and check drainage.";
    return "✅ Continue standard monitoring protocols.";
};

// --- Styles ---
const kpiStyle = { background: '#fff', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' };
const searchBarStyle = { padding: '8px 12px', width: '250px', borderRadius: '6px', border: '1px solid #ddd' };
const selectStyle = { padding: '8px', borderRadius: '6px', border: '1px solid #ddd', cursor: 'pointer' };
const btnStyle = { background: '#27ae60', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' };

const aiAdviceStyle = {
    background: '#f0f7ff',
    borderLeft: '3px solid #3498db',
    padding: '8px',
    fontSize: '11px',
    color: '#2c3e50',
    borderRadius: '0 4px 4px 0'
};

const hrActionStyle = {
    background: '#fff5f5',
    borderLeft: '3px solid #e74c3c',
    padding: '8px',
    fontSize: '11px',
    color: '#c0392b',
    borderRadius: '0 4px 4px 0',
    fontWeight: 'bold'
};

export default OperationalView;