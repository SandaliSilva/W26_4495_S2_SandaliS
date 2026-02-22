import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, 
  PieChart, Pie, Cell, AreaChart, Area, Legend 
} from 'recharts';

function Dashboard({ role }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/dashboard-stats')
      .then(res => res.json())
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch Error:", err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading SafeSight Intelligence...</div>;

  const COLORS = ['#d4af37', '#1a2a3a', '#27ae60', '#e74c3c', '#f39c12', '#8e44ad'];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px', backgroundColor: '#f8f9fa' }}>
      <header style={{ marginBottom: '30px', borderLeft: '8px solid #d4af37', paddingLeft: '20px' }}>
        <h1 style={{ color: '#1a2a3a' }}>SafeSight Intelligence Analytics</h1>
        <p>Fairmont Waterfront | Research Access: {role?.toUpperCase() || 'MANAGER'}</p>
      </header>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <h4>TOTAL INCIDENTS</h4>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{data.stats?.totalIncidents}</p>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <h4>CRITICAL RISKS</h4>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#e74c3c' }}>{data.stats?.criticalRisks}</p>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <h4>HOSPITALIZATION</h4>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#2980b9' }}>{data.stats?.hospitalization}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
        
        {/* 1. Incident Severity Mix (Pie Chart) */}
        <div style={{ background: '#fff', padding: '25px', borderRadius: '12px' }}>
          <h3>Severity Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={data.severityData || []} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {(data.severityData || []).map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 2. Incident Velocity Trend (Area Chart) */}
        <div style={{ background: '#fff', padding: '25px', borderRadius: '12px' }}>
          <h3>Incident Velocity Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data.trendData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="incidents" stroke="#d4af37" fill="#d4af37" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 3. Departmental Risk Profile (Bar Chart) */}
        <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', gridColumn: 'span 2' }}>
          <h3>Departmental Risk Profile</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.departmentData || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{fontSize: 10}} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#1a2a3a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;