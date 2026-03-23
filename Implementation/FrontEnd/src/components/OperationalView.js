import React from 'react';
import axios from 'axios';

const OperationalView = ({ data }) => {
    const handleResolve = async (id) => {
        try {
            await axios.patch(`http://localhost:5000/api/incidents/${id}/status`, { status: 'Resolved' });
            alert(`Incident #${id} Resolved!`);
            window.location.reload();
        } catch (err) {
            console.error("Update failed", err);
        }
    };

    return (
        <div style={{ animation: 'fadeIn 0.5s' }}>
            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
                <div style={kpiStyle}><h4>TOTAL LOGS</h4><p>{data.stats.totalIncidents}</p></div>
                <div style={kpiStyle}><h4>CRITICAL PENDING</h4><p style={{color: '#e74c3c'}}>{data.stats.criticalRisks}</p></div>
                <div style={kpiStyle}><h4>HOSPITALIZED</h4><p style={{color: '#3498db'}}>{data.stats.hospitalization}</p></div>
            </div>

            {/* Table */}
            <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginBottom: '15px', color: '#1a2a3a' }}>Recent Observations</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #f4f7f6', color: '#7f8c8d' }}>
                            <th style={{ padding: '12px' }}>ID</th>
                            <th>DEPARTMENT</th>
                            <th>TYPE</th>
                            <th>SEVERITY</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.recentIncidents.map((inc, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                <td style={{ padding: '12px', fontWeight: 'bold' }}>#S-{inc.incident_id}</td>
                                <td>{inc.department}</td>
                                <td>{inc.incident_type}</td>
                                <td>
                                    <span style={{ 
                                        color: inc.severity === 'Critical' ? '#e74c3c' : '#27ae60',
                                        fontWeight: 'bold'
                                    }}>{inc.severity}</span>
                                </td>
                                <td>
                                    <button 
                                        onClick={() => handleResolve(inc.incident_id)}
                                        style={btnStyle}
                                    >
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

const kpiStyle = { background: '#fff', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' };
const btnStyle = { background: '#27ae60', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' };

export default OperationalView; // This is the line your error is looking for!