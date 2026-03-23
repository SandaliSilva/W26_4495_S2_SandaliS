import React from 'react';

const SafeSightLayout = ({ title, subtitle, children, actions }) => {
  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* SHARED FAIRMONT HEADER */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        marginBottom: '30px', 
        borderLeft: '8px solid #d4af37', 
        paddingLeft: '20px' 
      }}>
        <div>
          <h1 style={{ color: '#1a2a3a', margin: 0 }}>{title}</h1>
          <p style={{ color: '#7f8c8d', margin: 0 }}>{subtitle}</p>
        </div>
        
        {/* Slot for the Excel Export Button or other Global Actions */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {actions}
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main>
        {children}
      </main>
    </div>
  );
};

// CRITICAL: This must be a default export if you import it as: import SafeSightLayout from './SafeSightLayout';
export default SafeSightLayout;