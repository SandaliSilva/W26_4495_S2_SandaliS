import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OperationalView = ({ data, userRole }) => {
    const [incidents, setIncidents] = useState(data.recentIncidents || []);
    const [searchTerm, setSearchTerm] = useState('');
    const [severityFilter, setSeverityFilter] = useState('All');
    const [hrResponses, setHrResponses] = useState({});

    useEffect(() => {
        setIncidents(data.recentIncidents);
    }, [data.recentIncidents]);

    const handleInputChange = (id, value) => {
        setHrResponses({ ...hrResponses, [id]: value });
    };

    const handleResolve = async (id) => {
        const actionText = hrResponses[id];
        if (userRole === 'hr' && (!actionText || actionText.trim() === "")) {
            alert("Corrective Action is mandatory for HR Resolution.");
            return;
        }

        try {
            await axios.patch(`http://localhost:5000/api/incidents/${id}/status`, { 
                status: 'Resolved',
                hr_action: actionText 
            });
            setIncidents(prev => prev.filter(inc => inc.incident_id !== id));
            alert(`Incident #S-${id} Resolved Successfully.`);
        } catch (err) {
            console.error("Update failed", err);
        }
    };

    const filteredIncidents = incidents.filter(inc => {
        const matchesSearch = (inc.department?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                             (inc.incident_type?.toLowerCase() || "").includes(searchTerm.toLowerCase());
        const matchesSeverity = severityFilter === 'All' || inc.severity === severityFilter;
        return matchesSearch && matchesSeverity;
    });

    return (
        <div style={{ animation: 'fadeIn 0.5s' }}>
            <style>{`
                .id-cell { position: relative; }
                .custom-tooltip {
                    visibility: hidden;
                    width: 280px;
                    background-color: #ffffff;
                    color: #2c3e50;
                    text-align: left;
                    border-radius: 8px;
                    padding: 12px;
                    position: absolute;
                    z-index: 999;
                    bottom: 125%;
                    left: 0;
                    opacity: 0;
                    transition: opacity 0.3s;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
                    border: 1px solid #ddd;
                    font-size: 11px;
                }
                .id-cell:hover .custom-tooltip {
                    visibility: visible;
                    opacity: 1;
                }
            `}</style>

            {/* --- KPI CARDS: ONLY SHOWN TO HR --- */}
            {userRole === 'hr' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
                    <div style={kpiStyle}><h4>TOTAL LOGS</h4><p>{data.stats.totalIncidents}</p></div>
                    <div style={kpiStyle}><h4>CRITICAL PENDING</h4><p style={{color: '#e74c3c'}}>{data.stats.criticalRisks}</p></div>
                    <div style={kpiStyle}><h4>HOSPITALIZED</h4><p style={{color: '#3498db'}}>{data.stats.hospitalization}</p></div>
                </div>
            )}

            {/* Filter Bar */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
                <input type="text" placeholder="Search Dept/Type..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={searchBarStyle} />
                <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} style={selectStyle}>
                    <option value="All">All Severities</option>
                    <option value="Critical">Critical Only</option>
                    <option value="High">High Only</option>
                    <option value="Medium">Medium Only</option>
                    <option value="Low">Low Only</option>
                </select>
            </div>

            <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginBottom: '15px', color: '#1a2a3a' }}>Active Safety Observations</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #f4f7f6', color: '#7f8c8d' }}>
                            <th style={{ padding: '12px' }}>ID (HOVER)</th>
                            <th>DEPT / TYPE</th>
                            <th>SEVERITY</th>
                            <th>AI RECOMMENDATION</th>
                            <th>HR FOLLOW-UP / ACTION</th>
                            {/* --- ACTION HEADER: ONLY SHOWN TO HR --- */}
                            {userRole === 'hr' && <th>CONTROL</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredIncidents.map((inc) => (
                            <tr key={inc.incident_id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                <td className="id-cell" style={{ padding: '12px' }}>
                                    <span style={{ fontWeight: 'bold', color: '#3498db', cursor: 'help' }}>#S-{inc.incident_id}</span>
                                    <div className="custom-tooltip">
                                        <div style={{ borderBottom: '1px solid #eee', marginBottom: '5px', fontWeight: 'bold' }}>INCIDENT DETAILS</div>
                                        <div><strong>Area:</strong> {inc.work_area || 'N/A'}</div>
                                        <div><strong>Shift:</strong> {inc.shift || 'N/A'}</div>
                                        <div style={{ marginTop: '5px' }}><strong>Desc:</strong> {inc.description}</div>
                                    </div>
                                </td>

                                <td><b>{inc.department}</b><br/><small>{inc.incident_type}</small></td>
                                <td><span style={{ color: getSeverityColor(inc.severity), fontWeight: 'bold' }}>{inc.severity}</span></td>
                                <td style={{ maxWidth: '200px' }}>
                                    <div style={aiAdviceStyle}>{getAIRecommendation(inc.severity, inc.incident_type)}</div>
                                </td>

                                <td style={{ padding: '10px', maxWidth: '250px' }}>
                                    {userRole === 'hr' ? (
                                        <textarea 
                                            placeholder="Mandatory HR Action..."
                                            style={textAreaStyle}
                                            value={hrResponses[inc.incident_id] || ''}
                                            onChange={(e) => handleInputChange(inc.incident_id, e.target.value)}
                                        />
                                    ) : (
                                        <div style={managerNoteStyle(inc.hr_action)}>
                                            <strong style={{fontSize: '9px', textTransform: 'uppercase'}}>Current HR Note:</strong><br/>
                                            {inc.hr_action || "Awaiting HR validation..."}
                                        </div>
                                    )}
                                </td>

                                {/* --- RESOLVE BUTTON: ONLY SHOWN TO HR --- */}
                                {userRole === 'hr' && (
                                    <td>
                                        <button onClick={() => handleResolve(inc.incident_id)} style={btnStyle}>
                                            Resolve
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- LOGIC & HELPERS (DO NOT TOUCH AI RECOMMENDATIONS) ---
const getSeverityColor = (s) => s==='Critical' ? '#e74c3c' : s==='High' ? '#e67e22' : s==='Medium' ? '#f1c40f' : '#27ae60';

const getAIRecommendation = (severity, type) => {
    const t = type ? type.toLowerCase() : "";
    if (severity === 'Critical') return "🚨 IMMEDIATE: Evacuate area & initiate Emergency Response Protocol.";
    if (severity === 'High') {
        if (t.includes('slip')) return "⚠️ HIGH: Cordon off zone; deploy anti-slip treatment immediately.";
        if (t.includes('chemical')) return "⚠️ HIGH: Secure MSDS; initiate specialized hazmat cleanup.";
        return "⚠️ HIGH: Alert Department Head and conduct immediate safety briefing.";
    }
    if (t.includes('slip') || t.includes('fall')) return "💡 TIP: Verify 'Wet Floor' signage & check for drainage blockages.";
    if (t.includes('sharp') || t.includes('cut')) return "💡 TIP: Review knife handling SOPs & inspect PPE.";
    if (t.includes('chemical') || t.includes('exposure')) return "💡 TIP: Ensure eyewash station access & active ventilation.";
    if (t.includes('aggressive') || t.includes('guest')) return "💡 TIP: Activate de-escalation protocol & notify Security.";
    return "✅ Standard monitoring: Ensure incident is logged in the monthly safety audit.";
};

const managerNoteStyle = (hasAction) => ({
    background: hasAction ? '#f0f9ff' : '#fff5f5',
    borderLeft: `3px solid ${hasAction ? '#3498db' : '#e74c3c'}`,
    padding: '8px', borderRadius: '4px', fontSize: '11px', color: '#2c3e50', lineHeight: '1.4'
});

const kpiStyle = { background: '#fff', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' };
const searchBarStyle = { padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd' };
const selectStyle = { padding: '8px', borderRadius: '6px', border: '1px solid #ddd' };
const btnStyle = { background: '#27ae60', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
const aiAdviceStyle = { background: '#f0f7ff', borderLeft: '3px solid #3498db', padding: '8px', fontSize: '11px', color: '#2c3e50' };
const textAreaStyle = { width: '100%', height: '50px', padding: '5px', fontSize: '11px', borderRadius: '4px', border: '1px solid #e74c3c', resize: 'none' };

export default OperationalView;