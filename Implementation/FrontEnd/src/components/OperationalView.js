import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OperationalView = ({ data }) => {
    // 1. Manage incidents in local state so they disappear immediately when resolved
    const [incidents, setIncidents] = useState(data.recentIncidents || []);
    const [searchTerm, setSearchTerm] = useState('');
    const [severityFilter, setSeverityFilter] = useState('All');
    const [hrResponses, setHrResponses] = useState({});

    // Sync state if data from props changes
    useEffect(() => {
        setIncidents(data.recentIncidents);
    }, [data.recentIncidents]);

    const handleInputChange = (id, value) => {
        setHrResponses({ ...hrResponses, [id]: value });
    };

    const handleResolve = async (id) => {
        const actionText = hrResponses[id];
        
        if (!actionText || actionText.trim() === "") {
            alert("Please enter an HR Corrective Action before resolving.");
            return;
        }

        try {
            // Updated API call to send hr_action to your new DB column
            const response = await axios.patch(`http://localhost:5000/api/incidents/${id}/status`, { 
                status: 'Resolved',
                hr_action: actionText 
            });

            if (response.status === 200) {
                // Remove from UI immediately without refreshing the page
                setIncidents(prev => prev.filter(inc => inc.incident_id !== id));
                alert(`Incident #S-${id} has been archived with HR notes.`);
            }
        } catch (err) {
            console.error("Update failed", err);
            alert("Error: Could not update incident. Check if your server is running.");
        }
    };

    // Filter logic using the local 'incidents' state
    const filteredIncidents = incidents.filter(inc => {
        const matchesSearch = (inc.department?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                             (inc.incident_type?.toLowerCase() || "").includes(searchTerm.toLowerCase());
        const matchesSeverity = severityFilter === 'All' || inc.severity === severityFilter;
        return matchesSearch && matchesSeverity;
    });

    return (
        <div style={{ animation: 'fadeIn 0.5s', padding: '10px' }}>
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
                            <th>HR CORRECTIVE ACTION (REQUIRED)</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredIncidents.length > 0 ? filteredIncidents.map((inc, i) => (
                            <tr key={inc.incident_id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                {/* FIXED HOVER: Matches your DB Column names exactly */}
                                <td 
                                    style={{ padding: '12px', fontWeight: 'bold', cursor: 'help', color: '#3498db' }}
                                    title={`FULL INCIDENT DETAILS:\n----------------------\nWork Area: ${inc.work_area || 'N/A'}\nShift: ${inc.shift || 'N/A'}\nDescription: ${inc.description || 'No description'}\nPPE Worn: ${inc.ppe_worn || 'None'}`}
                                >
                                    #S-{inc.incident_id}
                                </td>
                                
                                <td>
                                    <div style={{fontWeight: 'bold'}}>{inc.department}</div>
                                    <div style={{fontSize: '11px', color: '#95a5a6'}}>{inc.incident_type}</div>
                                </td>
                                <td><span style={{ color: getSeverityColor(inc.severity), fontWeight: 'bold' }}>{inc.severity}</span></td>
                                
                                <td style={{ maxWidth: '200px' }}>
                                    <div style={aiAdviceStyle}>{getAIRecommendation(inc.severity, inc.incident_type)}</div>
                                </td>

                                <td style={{ padding: '10px' }}>
                                    <textarea 
                                        placeholder="Enter mandatory HR response..."
                                        style={textAreaStyle}
                                        value={hrResponses[inc.incident_id] || ''}
                                        onChange={(e) => handleInputChange(inc.incident_id, e.target.value)}
                                    />
                                </td>

                                <td>
                                    <button onClick={() => handleResolve(inc.incident_id)} style={btnStyle}>Resolve</button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="6" style={{padding: '20px', textAlign: 'center', color: '#95a5a6'}}>No active incidents match your filters.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- Helpers ---
const getSeverityColor = (sev) => {
    if (sev === 'Critical') return '#e74c3c';
    if (sev === 'High') return '#e67e22';
    if (sev === 'Medium') return '#f1c40f';
    return '#27ae60';
};

const getAIRecommendation = (severity, type) => {
    if (severity === 'Critical') return "⚠️ Immediate medical response & supervisor alert.";
    if (type?.toLowerCase().includes('slip')) return "💡 Deploy 'Wet Floor' signs & inspect spills.";
    if (type?.toLowerCase().includes('chemical')) return "🛡️ Consult MSDS & ensure ventilation.";
    return "✅ Log incident & continue monitoring.";
};

// --- Styles ---
const kpiStyle = { background: '#fff', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' };
const searchBarStyle = { padding: '8px 12px', width: '250px', borderRadius: '6px', border: '1px solid #ddd' };
const selectStyle = { padding: '8px', borderRadius: '6px', border: '1px solid #ddd' };
const btnStyle = { background: '#27ae60', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
const aiAdviceStyle = { background: '#f0f7ff', borderLeft: '3px solid #3498db', padding: '8px', fontSize: '11px', color: '#2c3e50', borderRadius: '0 4px 4px 0' };
const textAreaStyle = { width: '100%', height: '60px', padding: '8px', fontSize: '11px', borderRadius: '6px', border: '1px solid #e74c3c', resize: 'none', fontFamily: 'inherit' };

export default OperationalView;


// import React, { useState } from 'react';
// import axios from 'axios';

// const OperationalView = ({ data }) => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [severityFilter, setSeverityFilter] = useState('All');

//     const handleResolve = async (id) => {
//         try {
//             await axios.patch(`http://localhost:5000/api/incidents/${id}/status`, { status: 'Resolved' });
//             alert(`Incident #S-${id} Resolved!`);
//             window.location.reload();
//         } catch (err) {
//             console.error("Update failed", err);
//         }
//     };

//     // Advanced Filtering: Search + Severity Dropdown
//     const filteredIncidents = data.recentIncidents.filter(inc => {
//         const matchesSearch = inc.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                              inc.incident_type.toLowerCase().includes(searchTerm.toLowerCase());
//         const matchesSeverity = severityFilter === 'All' || inc.severity === severityFilter;
//         return matchesSearch && matchesSeverity;
//     });

//     return (
//         <div style={{ animation: 'fadeIn 0.5s' }}>
//             {/* KPI Cards */}
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
//                 <div style={kpiStyle}><h4>TOTAL LOGS</h4><p>{data.stats.totalIncidents}</p></div>
//                 <div style={kpiStyle}><h4>CRITICAL PENDING</h4><p style={{color: '#e74c3c'}}>{data.stats.criticalRisks}</p></div>
//                 <div style={kpiStyle}><h4>HOSPITALIZED</h4><p style={{color: '#3498db'}}>{data.stats.hospitalization}</p></div>
//             </div>

//             {/* Filter Bar */}
//             <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
//                 <input 
//                     type="text" 
//                     placeholder="Filter by Dept/Type..." 
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     style={searchBarStyle}
//                 />
//                 <select 
//                     value={severityFilter} 
//                     onChange={(e) => setSeverityFilter(e.target.value)}
//                     style={selectStyle}
//                 >
//                     <option value="All">All Severities</option>
//                     <option value="Critical">Critical Only</option>
//                     <option value="High">High Only</option>
//                     <option value="Stable">Stable Only</option>
//                 </select>
//             </div>

//             {/* Table */}
//             <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
//                 <h3 style={{ marginBottom: '15px', color: '#1a2a3a' }}>Active Safety Observations</h3>
//                 <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
//                     <thead>
//                         <tr style={{ textAlign: 'left', borderBottom: '2px solid #f4f7f6', color: '#7f8c8d' }}>
//                             <th style={{ padding: '12px' }}>ID</th>
//                             <th>DEPT / TYPE</th>
//                             <th>SEVERITY</th>
//                             <th>INCIDENT DESCRIPTION</th>
//                             <th>AI RECOMMENDATION</th>
//                             <th>HR CORRECTIVE ACTION</th>
//                             <th>ACTION</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredIncidents.map((inc, i) => (
//                             <tr key={i} style={{ borderBottom: '1px solid #f9f9f9' }}>
//                                 <td style={{ padding: '12px', fontWeight: 'bold' }}>#S-{inc.incident_id}</td>
//                                 <td>
//                                     <div style={{fontWeight: 'bold'}}>{inc.department}</div>
//                                     <div style={{fontSize: '11px', color: '#95a5a6'}}>{inc.incident_type}</div>
//                                 </td>
//                                 <td>
//                                     <span style={{ color: inc.severity === 'Critical' ? '#e74c3c' : '#f39c12', fontWeight: 'bold' }}>
//                                         {inc.severity}
//                                     </span>
//                                 </td>
//                                 <td style={{ maxWidth: '200px', padding: '10px' }}>{inc.description}</td>
                                
//                                 {/* AI ADVICE COLUMN */}
//                                 <td style={{ maxWidth: '200px' }}>
//                                     <div style={aiAdviceStyle}>
//                                         {getAIRecommendation(inc.severity, inc.incident_type)}
//                                     </div>
//                                 </td>

//                                 {/* HR ONLY COLUMN */}
//                                 <td style={{ maxWidth: '200px' }}>
//                                     <div style={hrActionStyle}>
//                                         {inc.hr_action || "Awaiting HR Review"}
//                                     </div>
//                                 </td>

//                                 <td>
//                                     <button onClick={() => handleResolve(inc.incident_id)} style={btnStyle}>Resolve</button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// // Simple Logic for AI Advice (Can be expanded)
// const getAIRecommendation = (severity, type) => {
//     if (severity === 'Critical') return "⚠️ Immediate evacuation and medical response required.";
//     if (type.includes('Slip')) return "💡 Deploy 'Wet Floor' signage and check drainage.";
//     return "✅ Continue standard monitoring protocols.";
// };

// // --- Styles ---
// const kpiStyle = { background: '#fff', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' };
// const searchBarStyle = { padding: '8px 12px', width: '250px', borderRadius: '6px', border: '1px solid #ddd' };
// const selectStyle = { padding: '8px', borderRadius: '6px', border: '1px solid #ddd', cursor: 'pointer' };
// const btnStyle = { background: '#27ae60', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' };

// const aiAdviceStyle = {
//     background: '#f0f7ff',
//     borderLeft: '3px solid #3498db',
//     padding: '8px',
//     fontSize: '11px',
//     color: '#2c3e50',
//     borderRadius: '0 4px 4px 0'
// };

// const hrActionStyle = {
//     background: '#fff5f5',
//     borderLeft: '3px solid #e74c3c',
//     padding: '8px',
//     fontSize: '11px',
//     color: '#c0392b',
//     borderRadius: '0 4px 4px 0',
//     fontWeight: 'bold'
// };

// export default OperationalView;