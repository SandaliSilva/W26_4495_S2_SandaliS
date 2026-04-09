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
        
        // HR must provide notes
        if (userRole === 'hr' && (!actionText || actionText.trim() === "")) {
            alert("Corrective Action is mandatory for HR Resolution.");
            return;
        }

        try {
            await axios.patch(`http://localhost:5000/api/incidents/${id}/status`, { 
                status: 'Resolved',
                hr_action: actionText || "Reviewed by Manager" 
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
            {/* CSS FOR CUSTOM TOOLTIP */}
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

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
                <div style={kpiStyle}><h4>TOTAL LOGS</h4><p>{data.stats.totalIncidents}</p></div>
                <div style={kpiStyle}><h4>CRITICAL PENDING</h4><p style={{color: '#e74c3c'}}>{data.stats.criticalRisks}</p></div>
                <div style={kpiStyle}><h4>HOSPITALIZED</h4><p style={{color: '#3498db'}}>{data.stats.hospitalization}</p></div>
            </div>

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
                            {userRole === 'hr' && <th>HR CORRECTIVE ACTION</th>}
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredIncidents.map((inc) => (
                            <tr key={inc.incident_id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                {/* CUSTOM HOVER CELL */}
                                <td className="id-cell" style={{ padding: '12px' }}>
                                    <span style={{ fontWeight: 'bold', color: '#3498db', cursor: 'help' }}>
                                        #S-{inc.incident_id}
                                    </span>
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

                                {userRole === 'hr' && (
                                    <td style={{ padding: '10px' }}>
                                        <textarea 
                                            placeholder="Mandatory HR Action..."
                                            style={textAreaStyle}
                                            value={hrResponses[inc.incident_id] || ''}
                                            onChange={(e) => handleInputChange(inc.incident_id, e.target.value)}
                                        />
                                    </td>
                                )}

                                <td>
                                    <button onClick={() => handleResolve(inc.incident_id)} style={btnStyle}>
                                        Resolve
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- Helpers & Logic ---
const getSeverityColor = (s) => s==='Critical' ? '#e74c3c' : s==='High' ? '#e67e22' : s==='Medium' ? '#f1c40f' : '#27ae60';

// --- Restored Intelligent Logic ---
const getAIRecommendation = (severity, type) => {
    const t = type ? type.toLowerCase() : "";
    
    // Priority 1: Critical Life Safety
    if (severity === 'Critical') return "🚨 IMMEDIATE: Evacuate area & initiate Emergency Response Protocol.";
    
    // Priority 2: High Risk specific actions
    if (severity === 'High') {
        if (t.includes('slip')) return "⚠️ HIGH: Cordon off zone; deploy anti-slip treatment immediately.";
        if (t.includes('chemical')) return "⚠️ HIGH: Secure MSDS; initiate specialized hazmat cleanup.";
        return "⚠️ HIGH: Alert Department Head and conduct immediate safety briefing.";
    }

    // Priority 3: Type-based situational advice
    if (t.includes('slip') || t.includes('fall')) return "💡 TIP: Verify 'Wet Floor' signage & check for drainage blockages.";
    if (t.includes('sharp') || t.includes('cut')) return "💡 TIP: Review knife handling SOPs & inspect PPE (cut-resistant gloves).";
    if (t.includes('chemical') || t.includes('exposure')) return "💡 TIP: Ensure eyewash station is accessible & ventilation is active.";
    if (t.includes('aggressive') || t.includes('guest')) return "💡 TIP: Activate de-escalation protocol & notify Security Supervisor.";

    // Default
    return "✅ Standard monitoring: Ensure incident is logged in the monthly safety audit.";
};

const kpiStyle = { background: '#fff', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' };
const searchBarStyle = { padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd' };
const selectStyle = { padding: '8px', borderRadius: '6px', border: '1px solid #ddd' };
const btnStyle = { background: '#27ae60', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
const aiAdviceStyle = { background: '#f0f7ff', borderLeft: '3px solid #3498db', padding: '8px', fontSize: '11px', color: '#2c3e50' };
const textAreaStyle = { width: '100%', height: '50px', padding: '5px', fontSize: '11px', borderRadius: '4px', border: '1px solid #e74c3c', resize: 'none' };

export default OperationalView;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const OperationalView = ({ data }) => {
//     // 1. Manage incidents in local state so they disappear immediately when resolved
//     const [incidents, setIncidents] = useState(data.recentIncidents || []);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [severityFilter, setSeverityFilter] = useState('All');
//     const [hrResponses, setHrResponses] = useState({});

//     // Sync state if data from props changes
//     useEffect(() => {
//         setIncidents(data.recentIncidents);
//     }, [data.recentIncidents]);

//     const handleInputChange = (id, value) => {
//         setHrResponses({ ...hrResponses, [id]: value });
//     };

//     const handleResolve = async (id) => {
//         const actionText = hrResponses[id];
        
//         if (!actionText || actionText.trim() === "") {
//             alert("Please enter an HR Corrective Action before resolving.");
//             return;
//         }

//         try {
//             // Updated API call to send hr_action to your new DB column
//             const response = await axios.patch(`http://localhost:5000/api/incidents/${id}/status`, { 
//                 status: 'Resolved',
//                 hr_action: actionText 
//             });

//             if (response.status === 200) {
//                 // Remove from UI immediately without refreshing the page
//                 setIncidents(prev => prev.filter(inc => inc.incident_id !== id));
//                 alert(`Incident #S-${id} has been archived with HR notes.`);
//             }
//         } catch (err) {
//             console.error("Update failed", err);
//             alert("Error: Could not update incident. Check if your server is running.");
//         }
//     };

//     // Filter logic using the local 'incidents' state
//     const filteredIncidents = incidents.filter(inc => {
//         const matchesSearch = (inc.department?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
//                              (inc.incident_type?.toLowerCase() || "").includes(searchTerm.toLowerCase());
//         const matchesSeverity = severityFilter === 'All' || inc.severity === severityFilter;
//         return matchesSearch && matchesSeverity;
//     });

//     return (
//         <div style={{ animation: 'fadeIn 0.5s', padding: '10px' }}>
//             {/* KPI Cards */}
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
//                 <div style={kpiStyle}><h4>TOTAL LOGS</h4><p>{data.stats.totalIncidents}</p></div>
//                 <div style={kpiStyle}><h4>CRITICAL PENDING</h4><p style={{color: '#e74c3c'}}>{data.stats.criticalRisks}</p></div>
//                 <div style={kpiStyle}><h4>HOSPITALIZED</h4><p style={{color: '#3498db'}}>{data.stats.hospitalization}</p></div>
//             </div>

//             {/* Filter Bar */}
//             <div style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
//                 <input type="text" placeholder="Search Dept/Type..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={searchBarStyle} />
//                 <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} style={selectStyle}>
//                     <option value="All">All Severities</option>
//                     <option value="Critical">Critical Only</option>
//                     <option value="High">High Only</option>
//                     <option value="Medium">Medium Only</option>
//                     <option value="Low">Low Only</option>
//                 </select>
//             </div>

//             <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
//                 <h3 style={{ marginBottom: '15px', color: '#1a2a3a' }}>Active Safety Observations</h3>
//                 <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
//                     <thead>
//                         <tr style={{ textAlign: 'left', borderBottom: '2px solid #f4f7f6', color: '#7f8c8d' }}>
//                             <th style={{ padding: '12px' }}>ID (HOVER)</th>
//                             <th>DEPT / TYPE</th>
//                             <th>SEVERITY</th>
//                             <th>AI RECOMMENDATION</th>
//                             <th>HR CORRECTIVE ACTION (REQUIRED)</th>
//                             <th>ACTION</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredIncidents.length > 0 ? filteredIncidents.map((inc, i) => (
//                             <tr key={inc.incident_id} style={{ borderBottom: '1px solid #f9f9f9' }}>
//                                 {/* FIXED HOVER: Matches your DB Column names exactly */}
//                                 <td 
//                                     style={{ padding: '12px', fontWeight: 'bold', cursor: 'help', color: '#3498db' }}
//                                     title={`FULL INCIDENT DETAILS:\n----------------------\nWork Area: ${inc.work_area || 'N/A'}\nShift: ${inc.shift || 'N/A'}\nDescription: ${inc.description || 'No description'}\nPPE Worn: ${inc.ppe_worn || 'None'}`}
//                                 >
//                                     #S-{inc.incident_id}
//                                 </td>
                                
//                                 <td>
//                                     <div style={{fontWeight: 'bold'}}>{inc.department}</div>
//                                     <div style={{fontSize: '11px', color: '#95a5a6'}}>{inc.incident_type}</div>
//                                 </td>
//                                 <td><span style={{ color: getSeverityColor(inc.severity), fontWeight: 'bold' }}>{inc.severity}</span></td>
                                
//                                 <td style={{ maxWidth: '200px' }}>
//                                     <div style={aiAdviceStyle}>{getAIRecommendation(inc.severity, inc.incident_type)}</div>
//                                 </td>

//                                 <td style={{ padding: '10px' }}>
//                                     <textarea 
//                                         placeholder="Enter mandatory HR response..."
//                                         style={textAreaStyle}
//                                         value={hrResponses[inc.incident_id] || ''}
//                                         onChange={(e) => handleInputChange(inc.incident_id, e.target.value)}
//                                     />
//                                 </td>

//                                 <td>
//                                     <button onClick={() => handleResolve(inc.incident_id)} style={btnStyle}>Resolve</button>
//                                 </td>
//                             </tr>
//                         )) : (
//                             <tr><td colSpan="6" style={{padding: '20px', textAlign: 'center', color: '#95a5a6'}}>No active incidents match your filters.</td></tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// // --- Helpers ---
// const getSeverityColor = (sev) => {
//     if (sev === 'Critical') return '#e74c3c';
//     if (sev === 'High') return '#e67e22';
//     if (sev === 'Medium') return '#f1c40f';
//     return '#27ae60';
// };

// const getAIRecommendation = (severity, type) => {
//     if (severity === 'Critical') return "⚠️ Immediate medical response & supervisor alert.";
//     if (type?.toLowerCase().includes('slip')) return "💡 Deploy 'Wet Floor' signs & inspect spills.";
//     if (type?.toLowerCase().includes('chemical')) return "🛡️ Consult MSDS & ensure ventilation.";
//     return "✅ Log incident & continue monitoring.";
// };

// // --- Styles ---
// const kpiStyle = { background: '#fff', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' };
// const searchBarStyle = { padding: '8px 12px', width: '250px', borderRadius: '6px', border: '1px solid #ddd' };
// const selectStyle = { padding: '8px', borderRadius: '6px', border: '1px solid #ddd' };
// const btnStyle = { background: '#27ae60', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
// const aiAdviceStyle = { background: '#f0f7ff', borderLeft: '3px solid #3498db', padding: '8px', fontSize: '11px', color: '#2c3e50', borderRadius: '0 4px 4px 0' };
// const textAreaStyle = { width: '100%', height: '60px', padding: '8px', fontSize: '11px', borderRadius: '6px', border: '1px solid #e74c3c', resize: 'none', fontFamily: 'inherit' };

// export default OperationalView;