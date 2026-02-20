import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function Dashboard({ role }) {
  // These states will eventually be populated by your fetch() call to the BackEnd
  const [stats, setStats] = useState({
    totalIncidents: 82,      // Data from your SQL Result Grid
    ppeCompliance: 74,       // Calculated from your ppe_worn TINYINT column
    criticalRisks: 12,       // Count of 'High' or 'Critical' severity
    hospitalization: 5       // Count where hospitalized = 1
  });

  // Mock data representing your SQL "Result Grid" for the chart
  const departmentData = [
    { name: 'Maintenance', count: 82 },
    { name: 'Housekeeping', count: 48 },
    { name: 'Kitchen', count: 42 },
    { name: 'Operations', count: 26 },
    { name: 'Front Office', count: 22 },
  ];

  const containerStyle = { maxWidth: '1200px', margin: '0 auto', padding: '20px' };
  
  const cardStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    textAlign: 'center',
    borderBottom: '4px solid #d4af37' // Fairmont Gold Accent
  };

  const chartContainerStyle = {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    marginTop: '30px'
  };

  return (
    <div style={containerStyle}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ color: '#1a2a3a', fontSize: '2.2rem', marginBottom: '5px' }}>Safety Intelligence Overview</h1>
        <p style={{ color: '#7f8c8d' }}>Fairmont Waterfront Operations | Research Access: {role?.toUpperCase()}</p>
      </header>

      {/* KPI Section - Research Objectives 1, 2, and 4 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        <div style={cardStyle}>
          <h4 style={{ color: '#7f8c8d', margin: '0', fontSize: '13px', textTransform: 'uppercase' }}>Total Incidents</h4>
          <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#2c3e50', margin: '10px 0' }}>{stats.totalIncidents}</p>
        </div>
        <div style={cardStyle}>
          <h4 style={{ color: '#7f8c8d', margin: '0', fontSize: '13px', textTransform: 'uppercase' }}>PPE Compliance</h4>
          <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#27ae60', margin: '10px 0' }}>{stats.ppeCompliance}%</p>
        </div>
        <div style={cardStyle}>
          <h4 style={{ color: '#7f8c8d', margin: '0', fontSize: '13px', textTransform: 'uppercase' }}>Critical Risks</h4>
          <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#e74c3c', margin: '10px 0' }}>{stats.criticalRisks}</p>
        </div>
        <div style={cardStyle}>
          <h4 style={{ color: '#7f8c8d', margin: '0', fontSize: '13px', textTransform: 'uppercase' }}>Hospitalization</h4>
          <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#2980b9', margin: '10px 0' }}>{stats.hospitalization}</p>
        </div>
      </div>

      {/* Visualization Section - Objective 1: High-Risk Departments */}
      <div style={chartContainerStyle}>
        <h3 style={{ color: '#1a2a3a', marginBottom: '25px', borderLeft: '5px solid #d4af37', paddingLeft: '15px' }}>
          Incident Distribution by Department
        </h3>
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <BarChart data={departmentData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#2c3e50'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#2c3e50'}} />
              <Tooltip 
                contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                cursor={{fill: '#f4f7f6'}} 
              />
              <Bar dataKey="count" fill="#d4af37" radius={[10, 10, 0, 0]} barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <footer style={{ marginTop: '50px', textAlign: 'center', color: '#bdc3c7', fontSize: '12px' }}>
        © 2026 SafeSight Intelligence | Final Research Project | Fairmont Waterfront Data Analysis
      </footer>
    </div>
  );
}

export default Dashboard;