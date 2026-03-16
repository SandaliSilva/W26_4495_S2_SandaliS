import React, { useState, useEffect } from 'react';
import { ShieldAlert, TrendingUp, CheckCircle, Activity } from 'lucide-react'; // Optional: npm install lucide-react

const Prediction = () => {
    const [forecasts, setForecasts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/api/ai-forecast')
            .then(res => res.json())
            .then(data => {
                setForecasts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("AI Fetch Error:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>🤖 AI is analyzing historical patterns...</div>;

    return (
        <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial' }}>
            <header style={{ marginBottom: '40px', borderBottom: '2px solid #d4af37', paddingBottom: '10px' }}>
                <h1 style={{ color: '#1a2a3a', margin: 0 }}>SafeSight AI: Predictive Risk Engine</h1>
                <p style={{ color: '#7f8c8d' }}>Random Forest Classifier Analysis</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
                {forecasts.map((item, index) => (
                    <div key={index} style={{
                        background: '#fff',
                        borderRadius: '15px',
                        padding: '20px',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                        borderTop: `6px solid ${item.predicted_severity === 'Critical' ? '#e74c3c' : '#f1c40f'}`,
                        position: 'relative'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, color: '#2c3e50' }}>{item.department}</h3>
                            <span style={{ 
                                padding: '5px 12px', 
                                borderRadius: '20px', 
                                fontSize: '12px', 
                                fontWeight: 'bold',
                                background: item.predicted_severity === 'Critical' ? '#fdecea' : '#fff9db',
                                color: item.predicted_severity === 'Critical' ? '#e74c3c' : '#f08c00'
                            }}>
                                {item.predicted_severity} Risk
                            </span>
                        </div>

                        <div style={{ margin: '20px 0' }}>
                            <div style={{ fontSize: '12px', color: '#95a5a6', marginBottom: '5px' }}>RISK PROBABILITY</div>
                            <div style={{ height: '12px', background: '#ecf0f1', borderRadius: '10px', overflow: 'hidden' }}>
                                <div style={{ 
                                    width: item.risk_probability, 
                                    height: '100%', 
                                    background: `linear-gradient(90deg, #d4af37, ${item.predicted_severity === 'Critical' ? '#e74c3c' : '#f39c12'})`,
                                    transition: 'width 1s ease-in-out'
                                }}></div>
                            </div>
                            <div style={{ textAlign: 'right', fontSize: '14px', fontWeight: 'bold', marginTop: '5px' }}>{item.risk_probability}</div>
                        </div>

                        <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '10px', fontSize: '14px' }}>
                            <strong style={{ color: '#1a2a3a' }}>Prescriptive Action:</strong><br/>
                            <p style={{ margin: '5px 0 0 0', fontStyle: 'italic', color: '#34495e' }}>{item.recommendation}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Prediction;