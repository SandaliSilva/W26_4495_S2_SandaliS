import React, { useState } from 'react';

function Login({ onLogin }) {
  const [role, setRole] = useState('manager');

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #1a2a3a 0%, #0d151d 100%)', // Deep Slate Professional Gradient
    color: '#ffffff'
  };

  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: '40px',
    borderRadius: '15px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    width: '350px',
    textAlign: 'center'
  };

  const buttonStyle = {
    backgroundColor: '#d4af37', // Safety Gold
    color: '#1a2a3a',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '25px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    marginTop: '20px',
    width: '100%',
    transition: 'transform 0.2s ease'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ marginBottom: '10px' }}>SafeSight Portal</h2>
        <p style={{ color: '#bdc3c7', marginBottom: '30px', fontSize: '14px' }}>Secure Research Environment</p>
        
        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
          <label style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Select Access Level</label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', background: '#2c3e50', color: 'white', border: '1px solid #34495e' }}
          >
            <option value="manager">Department Manager</option>
            <option value="hr">HR Administrator</option>
          </select>
        </div>

        <button style={buttonStyle} onClick={() => onLogin(role)}>
          AUTHORIZE ACCESS
        </button>
      </div>
    </div>
  );
}

export default Login;