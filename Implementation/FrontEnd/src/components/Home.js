import React from 'react';

function Home() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
      <header style={{ marginBottom: '50px' }}>
        <h1 style={{ fontSize: '3.5rem', color: '#1a2a3a', fontWeight: '800' }}>
          SafeSight <span style={{ color: '#d4af37' }}>Intelligence</span>
        </h1>
        <p style={{ fontSize: '1.4rem', color: '#7f8c8d', maxWidth: '900px', margin: '20px auto' }}>
          An advanced data-driven framework for hospitality safety management, 
          integrating predictive analytics and automated compliance reporting.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '50px' }}>
        <div style={featureCard}>
          <h3 style={{ color: '#d4af37' }}>Predictive Risk Modeling</h3>
          <p>Utilizing historical incident data to forecast high-risk shifts and departments.</p>
        </div>
        <div style={featureCard}>
          <h3 style={{ color: '#d4af37' }}>Real-time Incident Logging</h3>
          <p>Standardized data entry for granular tracking of root causes and PPE compliance.</p>
        </div>
        <div style={featureCard}>
          <h3 style={{ color: '#d4af37' }}>Automated Compliance</h3>
          <p>Direct export systems for WorkSafeBC documentation and internal safety audits.</p>
        </div>
      </div>
    </div>
  );
}

const featureCard = {
  padding: '40px',
  backgroundColor: '#ffffff',
  borderRadius: '15px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
  border: '1px solid #eee'
};

export default Home;