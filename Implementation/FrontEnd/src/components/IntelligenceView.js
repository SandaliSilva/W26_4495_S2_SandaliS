import React from 'react';
import { 
    PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, 
    XAxis, YAxis, Tooltip, Radar, RadarChart, PolarGrid, 
    PolarAngleAxis, PolarRadiusAxis, BarChart, Bar, Legend, 
    CartesianGrid 
} from 'recharts';

// 🏨 Refined Fairmont Palette for Data Clarity
const FAIRMONT_GOLD = '#C5A059';
const FAIRMONT_CHARCOAL = '#2D2D2D';
const SAFE_GREEN = '#7FB069'; // Softer, positive green for "Stable"
const DANGER_RED = '#96281B';
const SOFT_BRONZE = '#A68966';

// Map colors to status for instant recognition
const STATUS_COLORS = { 
    High: DANGER_RED, 
    Elevated: FAIRMONT_GOLD, 
    Stable: SAFE_GREEN 
};

// Distinct colors for the Pie Chart slices
const PIE_COLORS = [FAIRMONT_CHARCOAL, FAIRMONT_GOLD, SOFT_BRONZE, '#5D6D7E', '#AEB6BF'];

const IntelligenceView = ({ data, aiPredictions }) => {
    if (!data) return null;

    const cardStyle = { 
        background: '#fff', 
        padding: '24px', 
        borderRadius: '4px', 
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)', 
        border: '1px solid #e1e1e1' 
    };

    const headerStyle = { 
        color: FAIRMONT_CHARCOAL, 
        fontSize: '13px', 
        letterSpacing: '1.5px', 
        textTransform: 'uppercase', 
        marginBottom: '25px', 
        fontWeight: '700',
        borderLeft: `4px solid ${FAIRMONT_GOLD}`,
        paddingLeft: '12px'
    };

    return (
        <div style={{ animation: 'fadeIn 0.8s ease-out', paddingBottom: '40px', background: '#fcfcfc', padding: '20px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '25px', marginBottom: '30px' }}>
                {/* 1. Risk Velocity with clear Legend */}
                <div style={cardStyle}>
                    <h3 style={headerStyle}>Risk Velocity (Historical Trend)</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={data.trendData}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={FAIRMONT_GOLD} stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor={FAIRMONT_GOLD} stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 11}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 11}} />
                            <Tooltip 
                                contentStyle={{border: `1px solid ${FAIRMONT_GOLD}`, borderRadius: '0'}}
                                formatter={(value) => [value, "Total Incidents"]}
                            />
                            <Legend verticalAlign="top" align="right" />
                            <Area name="Incident Volume" type="monotone" dataKey="value" stroke={FAIRMONT_GOLD} fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* 2. Pie Chart with Distinct Colors */}
                <div style={cardStyle}>
                    <h3 style={headerStyle}>Severity Mix</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={data.severityData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4}>
                                {data.severityData.map((entry, index) => (
                                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '30px' }}>
                <div style={cardStyle}>
    <h3 style={headerStyle}>Department Risk Profile</h3>
    <ResponsiveContainer width="100%" height={350}>
        <BarChart 
            data={data.departmentData} 
            layout="vertical" 
            margin={{ left: 50, right: 30 }}
        >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#eee" />
            <XAxis type="number" axisLine={false} tickLine={false} tick={{fontSize: 11}} />
            <YAxis 
                dataKey="name" 
                type="category" 
                width={120} 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 11, fill: FAIRMONT_CHARCOAL, fontWeight: '600'}} 
            />
            <Tooltip cursor={{fill: '#f5f5f5'}} />
            <Legend verticalAlign="top" align="right" iconType="rect" />

            {/* 🎨 THE COLOR FIX: Mapping bars to Severity Status */}
            <Bar name="Critical/High" dataKey="High" stackId="a" fill={DANGER_RED} barSize={20} />
            <Bar name="Medium/Elevated" dataKey="Medium" stackId="a" fill={FAIRMONT_GOLD} />
            <Bar name="Low/Stable" dataKey="Low" stackId="a" fill={SAFE_GREEN} radius={[0, 4, 4, 0]} />
        </BarChart>
    </ResponsiveContainer>
</div>

                <div style={cardStyle}>
                    <h3 style={headerStyle}>Safety Profile Radar</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <RadarChart data={data.departmentData}>
                            <PolarGrid stroke="#eee" />
                            <PolarAngleAxis dataKey="name" tick={{fontSize: 10}} />
                            <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                            <Radar name="Total Incidents" dataKey="total" stroke={FAIRMONT_GOLD} fill={FAIRMONT_GOLD} fillOpacity={0.4} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* AI Section with Logical Colors */}
            <h3 style={{ ...headerStyle, borderLeft: 'none', borderBottom: `2px solid ${FAIRMONT_GOLD}`, display: 'inline-block' }}>
                SafeSight AI: 30-Day Predictive Analysis
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginTop: '25px' }}>
                {aiPredictions.map((pred, i) => (
                    <div key={i} style={{ 
                        ...cardStyle,
                        borderTop: `6px solid ${STATUS_COLORS[pred.risk_probability]}`,
                        borderRadius: '12px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <strong style={{ fontSize: '18px', color: FAIRMONT_CHARCOAL }}>{pred.department}</strong>
                            <span style={{ 
                                background: pred.risk_probability === 'High' ? '#fdeaea' : pred.risk_probability === 'Elevated' ? '#fff3e0' : '#e8f5e9',
                                color: STATUS_COLORS[pred.risk_probability],
                                padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold'
                            }}>
                                {pred.risk_probability}
                            </span>
                        </div>

                        <div style={{ margin: '20px 0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '5px' }}>
                                <span>Prediction Confidence</span>
                                <strong>{pred.confidence}</strong>
                            </div>
                            <div style={{ background: '#f0f2f5', height: '8px', borderRadius: '10px' }}>
                                <div style={{ 
                                    width: pred.confidence, 
                                    background: STATUS_COLORS[pred.risk_probability],
                                    height: '100%', borderRadius: '10px'
                                }} />
                            </div>
                        </div>

                        <p style={{ fontSize: '13px', color: '#34495e', background: '#f8f9fa', padding: '12px', borderRadius: '8px', borderLeft: `4px solid ${STATUS_COLORS[pred.risk_probability]}` }}>
                            <strong>Action:</strong> {pred.recommendation}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IntelligenceView;
// import React from 'react';
// import { 
//     PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, 
//     XAxis, YAxis, Tooltip, Radar, RadarChart, PolarGrid, 
//     PolarAngleAxis, PolarRadiusAxis, BarChart, Bar, Legend, 
//     CartesianGrid 
// } from 'recharts';

// const COLORS = ['#e74c3c', '#f39c12', '#27ae60', '#3498db', '#9b59b6'];

// const IntelligenceView = ({ data, aiPredictions }) => {
//     if (!data) return null;

//     const cardStyle = { background: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #f0f2f5' };
//     const titleStyle = { color: '#1a2a3a', fontSize: '16px', marginBottom: '20px', fontWeight: '600' };

//     return (
//         <div style={{ animation: 'fadeIn 0.8s ease-out', paddingBottom: '40px' }}>
            
//             {/* ROW 1: TRENDS & SEVERITY */}
//             <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '25px' }}>
//                 <div style={cardStyle}>
//                     <h3 style={titleStyle}>Chart 1: Risk Velocity (Historical Trend)</h3>
//                     <ResponsiveContainer width="100%" height={250}>
//                         <AreaChart data={data.trendData}>
//                             <defs>
//                                 <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
//                                     <stop offset="5%" stopColor="#1a2a3a" stopOpacity={0.3}/>
//                                     <stop offset="95%" stopColor="#1a2a3a" stopOpacity={0}/>
//                                 </linearGradient>
//                             </defs>
//                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
//                             <XAxis dataKey="name" axisLine={false} tickLine={false} />
//                             <YAxis axisLine={false} tickLine={false} />
//                             <Tooltip />
//                             <Area type="monotone" dataKey="value" stroke="#1a2a3a" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
//                         </AreaChart>
//                     </ResponsiveContainer>
//                 </div>

//                 <div style={cardStyle}>
//                     <h3 style={titleStyle}>Chart 2: Severity Mix</h3>
//                     <ResponsiveContainer width="100%" height={250}>
//                         <PieChart>
//                             <Pie data={data.severityData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
//                                 {data.severityData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
//                             </Pie>
//                             <Tooltip />
//                             <Legend verticalAlign="bottom" iconType="circle" />
//                         </PieChart>
//                     </ResponsiveContainer>
//                 </div>
//             </div>

//             {/* ROW 2: CROSS-DEPT PROFILE */}
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
//                 <div style={cardStyle}>
//                     <h3 style={titleStyle}>Chart 3: Safety Profile Radar</h3>
//                     <ResponsiveContainer width="100%" height={300}>
//                         <RadarChart data={data.departmentData}>
//                             <PolarGrid stroke="#e0e0e0" />
//                             <PolarAngleAxis dataKey="name" />
//                             <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
//                             <Radar name="Total Incidents" dataKey="total" stroke="#d4af37" fill="#d4af37" fillOpacity={0.5} />
//                             <Tooltip />
//                         </RadarChart>
//                     </ResponsiveContainer>
//                 </div>

//                 <div style={cardStyle}>
//                     <h3 style={titleStyle}>Chart 4: Risk Density Mapping</h3>
//                     <ResponsiveContainer width="100%" height={300}>
//                         <BarChart data={data.departmentData} layout="vertical" margin={{ left: 20 }}>
//                             <XAxis type="number" hide />
//                             <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} />
//                             <Tooltip cursor={{fill: 'transparent'}} />
//                             <Legend />
//                             <Bar dataKey="Critical" stackId="a" fill="#e74c3c" barSize={20} />
//                             <Bar dataKey="High" stackId="a" fill="#f39c12" />
//                             <Bar dataKey="Low" stackId="a" fill="#27ae60" radius={[0, 5, 5, 0]} />
//                         </BarChart>
//                     </ResponsiveContainer>
//                 </div>
//             </div>

//             {/* AI STRATEGY SECTION (UPDATED FOR FUTURE PREDICTIONS) */}
//             <h3 style={{ ...titleStyle, fontSize: '20px', display: 'flex', alignItems: 'center', marginTop: '40px' }}>
//                 <span style={{ marginRight: '10px' }}>🔮</span> 30-Day Predictive Forecasting
//             </h3>
            
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
//                 {aiPredictions.map((pred, i) => (
//                     <div key={i} style={{ 
//                         background: '#fff', padding: '25px', borderRadius: '16px', 
//                         borderTop: `6px solid ${pred.risk_probability === 'High' ? '#e74c3c' : pred.risk_probability === 'Elevated' ? '#f39c12' : '#27ae60'}`,
//                         boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
//                         position: 'relative'
//                     }}>
//                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//                             <div>
//                                 <strong style={{ fontSize: '18px', display: 'block' }}>{pred.department}</strong>
//                                 <span style={{ fontSize: '10px', color: '#999', textTransform: 'uppercase' }}>Dept Forecast</span>
//                             </div>
//                             <span style={{ 
//                                 background: pred.risk_probability === 'High' ? '#fdeaea' : pred.risk_probability === 'Elevated' ? '#fff3e0' : '#e8f5e9',
//                                 color: pred.risk_probability === 'High' ? '#e74c3c' : pred.risk_probability === 'Elevated' ? '#e67e22' : '#27ae60',
//                                 padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold'
//                             }}>
//                                 {pred.risk_probability}
//                             </span>
//                         </div>

//                         {/* Statistical Confidence Meter */}
//                         <div style={{ margin: '20px 0' }}>
//                             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '5px' }}>
//                                 <span style={{ color: '#7f8c8d' }}>Prediction Confidence</span>
//                                 <span style={{ fontWeight: 'bold' }}>{pred.confidence}</span>
//                             </div>
//                             <div style={{ background: '#f0f2f5', height: '8px', borderRadius: '10px' }}>
//                                 <div style={{ 
//                                     width: pred.confidence, 
//                                     background: pred.risk_probability === 'High' ? '#e74c3c' : '#27ae60',
//                                     height: '100%', borderRadius: '10px',
//                                     transition: 'width 1s ease-in-out'
//                                 }} />
//                             </div>
//                         </div>

//                         <p style={{ fontSize: '13px', color: '#34495e', lineHeight: '1.6', background: '#f8f9fa', padding: '10px', borderRadius: '8px', borderLeft: '4px solid #dcdde1' }}>
//                             <strong>Strategic Action:</strong> {pred.recommendation}
//                         </p>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default IntelligenceView;