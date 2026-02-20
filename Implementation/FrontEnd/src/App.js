import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

// Component Imports
import Home from './components/Home';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ReportIncident from './components/ReportIncident';
import Prediction from './components/Prediction';
import WorkSafeBCExport from './components/WorkSafeBCExport';

function App() {
  const [user, setUser] = useState(null); 

  const logout = () => {
    setUser(null);
  };

  // Professional Navigation Styling
  const navStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 40px',
    backgroundColor: '#ffffff',
    borderBottom: '3px solid #d4af37', // Safety Gold Accent
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  };

  const linkStyle = {
    color: '#2c3e50',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  };

  return (
    <Router>
      <div style={{ fontFamily: 'Segoe UI, Tahoma, sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
        
        {/* GLOBAL HEADER: Always visible for branding consistency */}
        <nav style={navStyle}>
          <Link to="/">
            <img 
              src="/SafesSightLogo.png" 
              alt="SafeSight Logo" 
              style={{ height: '60px', width: 'auto', display: 'block', cursor: 'pointer' }} 
            />
          </Link>

          {/* AUTHORIZED NAVIGATION: Visible only after login */}
          {user ? (
            <div style={{ display: 'flex', gap: '30px', alignItems: 'center', marginLeft: 'auto' }}>
              <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
              
              {user === 'manager' && (
                <Link to="/report" style={linkStyle}>Log Incident</Link>
              )}

              {user === 'hr' && (
                <>
                  <Link to="/prediction" style={linkStyle}>Analytics</Link>
                  <Link to="/export" style={linkStyle}>WorkSafeBC</Link>
                </>
              )}
              
              <button onClick={logout} style={{ 
                backgroundColor: '#2c3e50', color: 'white', border: 'none', 
                padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' 
              }}>Logout</button>
            </div>
          ) : (
            /* UNAUTHORIZED NAVIGATION: Visible on Home/Login pages */
            <div style={{ marginLeft: 'auto' }}>
              <Link to="/login">
                <button style={{ 
                  backgroundColor: '#d4af37', color: '#1a2a3a', border: 'none', 
                  padding: '10px 25px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' 
                }}>STAFF LOGIN</button>
              </Link>
            </div>
          )}
        </nav>

        {/* MAIN CONTENT AREA */}
        <div style={{ padding: '40px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={!user ? <Login onLogin={setUser} /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={user ? <Dashboard role={user} /> : <Navigate to="/" />} />
            <Route path="/report" element={user === 'manager' ? <ReportIncident /> : <Navigate to="/" />} />
            <Route path="/prediction" element={user === 'hr' ? <Prediction /> : <Navigate to="/" />} />
            <Route path="/export" element={user === 'hr' ? <WorkSafeBCExport /> : <Navigate to="/" />} />
          </Routes>
          <footer style={{ textAlign: 'center', padding: '20px', color: '#7f8c8d', fontSize: '12px' }}>
  © 2026 SafeSight Intelligence | Final Research Framework | Fairmont Waterfront Data Analysis
</footer>
        </div>
      </div>
    </Router>
  );
}

export default App;