import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SafeSightLayout from './SafeSightLayout';
import OperationalView from './OperationalView';
import IntelligenceView from './IntelligenceView';

// Receive 'role' directly from App.js
function Dashboard({ role }) {
    const userRole = (role || localStorage.getItem('userRole') || 'manager').toLowerCase();

    // 1. Initialize view based on the current role
    const [view, setView] = useState(userRole === 'hr' ? 'ops' : 'intel'); 
    const [data, setData] = useState(null);
    const [aiPredictions, setAiPredictions] = useState([]);
    const [loading, setLoading] = useState(true);

    // 2. If the role changes (e.g., during login), sync the view
    useEffect(() => {
        if (userRole === 'hr') setView('ops');
        else setView('intel');
    }, [userRole]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsRes = await axios.get('http://localhost:5000/api/dashboard-stats');
                setData(statsRes.data);
                try {
                    const aiRes = await axios.get('http://localhost:5000/api/ai-forecast');
                    setAiPredictions(aiRes.data);
                } catch (aiErr) {
                    console.warn("AI Engine offline");
                }
                setLoading(false);
            } catch (err) {
                console.error("Backend offline", err);
            }
        };
        fetchData();
    }, []);

    if (loading || !data) return <div style={{textAlign: 'center', padding: '100px', color: '#fff'}}>Loading SafeSight...</div>;

    const tabBtnStyle = { 
        padding: '10px 20px', 
        cursor: 'pointer', 
        border: 'none', 
        borderRadius: '8px',
        fontWeight: 'bold', 
        transition: '0.3s'
    };

    return (
        <SafeSightLayout 
            title="SafeSight Command Center" 
            subtitle={view === 'ops' ? "Operational Control" : "AI Strategic Intelligence"}
        >
            <div style={{ display: 'flex', gap: '20px', marginBottom: '25px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                
                {/* STRATEGY: 
                  We let Managers see the 'Operations' TAB BUTTON now, 
                  so they can actually click into it to see their follow-ups.
                */}
                <button 
                    onClick={() => setView('ops')}
                    style={{ 
                        ...tabBtnStyle, 
                        background: view === 'ops' ? '#1a2a3a' : '#f4f7f6',
                        color: view === 'ops' ? '#fff' : '#7f8c8d',
                    }}
                >
                    📋 Operations
                </button>

                <button 
                    onClick={() => setView('intel')}
                    style={{ 
                        ...tabBtnStyle, 
                        background: view === 'intel' ? '#1a2a3a' : '#f4f7f6',
                        color: view === 'intel' ? '#fff' : '#7f8c8d',
                    }}
                >
                    🧠 AI Intelligence
                </button>
            </div>

            {/* --- THE UPDATED GATE --- */}
            {/* We now allow the view to be 'ops' regardless of the role */}
            {view === 'ops' ? (
                <OperationalView data={data} userRole={userRole} />
            ) : (
                <IntelligenceView data={data} aiPredictions={aiPredictions} />
            )}
        </SafeSightLayout>
    );
}

export default Dashboard;