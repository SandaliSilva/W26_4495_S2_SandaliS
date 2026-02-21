import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, 
  PieChart, Pie, Cell, LineChart, Line, Legend 
} from 'recharts';

function Dashboard({ role }) {
  const [stats] = useState({
    totalIncidents: 82,      
    ppeCompliance: 74,       
    criticalRisks: 12,       
    hospitalization: 5       
  });

  // Data for Department Frequency (Objective 1)
  const departmentData = [
    { name: 'Maintenance', count: 82 },
    { name: 'Housekeeping', count: 48 },
    { name: 'Kitchen', count: 42 },
    { name: 'Operations', count: 26 },
    { name: 'Front Office', count: 22 }
  ];

  // Data for Severity Distribution (Objective 3)
  const severityData = [
    { name: 'Low', value: 45, color: '#27ae60' },
    { name: 'Medium', value: 25, color: '#f39c12' },
    { name: 'High', value: 10, color: '#e67e22' },
    { name: 'Critical', value: 2, color: '#e74c3c' }
  ];

  // Temporal Trend Data (Predictive Baseline)
  const trendData = [
    { month: 'Sept', incidents: 5 },
    { month: 'Oct', incidents: 8 },
    { month: 'Nov', incidents: 12 },
    { month: 'Dec', incidents: 7 },
    { month: 'Jan', incidents: 15 },
    { month: 'Feb', incidents: 10 }
  ];

  const sectionStyle = {
    backgroundColor: '#fff',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    marginBottom: '30px'
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ color: '#1a2a3a' }}>Safety Intelligence Dashboard</h1>
        <p style={{ color: '#7f8c8d' }}>Fairmont Waterfront Research Portal</p>
      </header>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        {/* ... (Previous KPI Cards) ... */}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        
        {/* 1. Bar Chart: Department Frequency */}
        <div style={sectionStyle}>
          <h3 style={{ color: '#1a2a3a', fontSize: '1rem', marginBottom: '20px' }}>Incidents by Department</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={departmentData}>
              <XAxis dataKey="name" tick={{fontSize: 10}} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#d4af37" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 2. Pie Chart: Severity Distribution (Advanced Research Objective) */}
        <div style={sectionStyle}>
          <h3 style={{ color: '#1a2a3a', fontSize: '1rem', marginBottom: '20px' }}>Severity Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={severityData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} label>
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Line Chart: Temporal Incident Trends */}
      <div style={sectionStyle}>
        <h3 style={{ color: '#1a2a3a', fontSize: '1rem', marginBottom: '20px' }}>6-Month Incident Velocity</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="incidents" stroke="#1a2a3a" strokeWidth={3} dot={{ r: 6, fill: '#d4af37' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;