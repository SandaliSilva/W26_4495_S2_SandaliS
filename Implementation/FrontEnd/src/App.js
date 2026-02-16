import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

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

return (
<Router>
<div style={{ fontFamily: 'Arial, sans-serif' }}>
{user && (
<nav style={{
padding: '15px',
backgroundColor: '#2c3e50',
color: 'white',
display: 'flex',
gap: '20px',
alignItems: 'center'
}}>
<span style={{ fontWeight: 'bold', marginRight: 'auto' }}>
SafeSight | Role: {user.toUpperCase()}
</span>
<Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
        
        {user === 'manager' && (
          <Link to="/report" style={{ color: 'white', textDecoration: 'none' }}>Report Incident</Link>
        )}

        {user === 'hr' && (
          <>
            <Link to="/prediction" style={{ color: 'white', textDecoration: 'none' }}>Predictions</Link>
            <Link to="/export" style={{ color: 'white', textDecoration: 'none' }}>WorkSafeBC Export</Link>
          </>
        )}
        
        <button onClick={logout} style={{ padding: '5px 10px', cursor: 'pointer' }}>Logout</button>
      </nav>
    )}

    <div style={{ padding: '20px' }}>
      <Routes>
        <Route path="/" element={!user ? <Login onLogin={setUser} /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={user ? <Dashboard role={user} /> : <Navigate to="/" />} />
        <Route path="/report" element={user === 'manager' ? <ReportIncident /> : <Navigate to="/" />} />
        <Route path="/prediction" element={user === 'hr' ? <Prediction /> : <Navigate to="/" />} />
        <Route path="/export" element={user === 'hr' ? <WorkSafeBCExport /> : <Navigate to="/" />} />
      </Routes>
    </div>
  </div>
</Router>
);
}
export default App;