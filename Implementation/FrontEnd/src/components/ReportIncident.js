import React, { useState } from 'react';

function ReportIncident() {
  const [formData, setFormData] = useState({
    department: 'Housekeeping',
    work_area: '',
    shift: 'Morning',
    incident_datetime: '',
    incident_type: 'Slip/Fall',
    description: '',
    severity: 'Low',
    root_cause: '',
    ppe_worn: false,
    hospitalized: false,
    status: 'Open'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Convert booleans to 1/0 for your TINYINT columns before sending to BackEnd
    const submissionData = {
      ...formData,
      ppe_worn: formData.ppe_worn ? 1 : 0,
      hospitalized: formData.hospitalized ? 1 : 0
    };
    
    console.log("Submitting Research Data:", submissionData);
    // You will later use fetch() here to post to your Node.js endpoint
    alert("Incident Logged for Advanced Analysis");
  };

  const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#2c3e50', fontSize: '14px' };
  const inputStyle = { width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: '#fff', padding: '40px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <h2 style={{ borderBottom: '2px solid #d4af37', paddingBottom: '10px', marginBottom: '30px', color: '#1a2a3a' }}>
        Advanced Safety Incident Reporting
      </h2>
      
      <form onSubmit={handleSubmit}>
        {/* Row 1: Department and Work Area */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={labelStyle}>Department</label>
            <select style={inputStyle} value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})}>
              <option>Housekeeping</option>
              <option>F&B (Kitchen)</option>
              <option>Front Office</option>
              <option>Maintenance</option>
              <option>Stewarding</option>
              <option>Spa & Health Club</option>
              <option>Security</option>
              <option>Guest Services</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Specific Work Area</label>
            <input 
              type="text" 
              style={inputStyle} 
              placeholder="e.g. Lobby, Kitchen Line, Room 402"
              value={formData.work_area} 
              onChange={(e) => setFormData({...formData, work_area: e.target.value})} 
            />
          </div>
        </div>

        {/* Row 2: Shift and Date/Time */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={labelStyle}>Shift</label>
            <select style={inputStyle} value={formData.shift} onChange={(e) => setFormData({...formData, shift: e.target.value})}>
              <option>Morning</option>
              <option>Afternoon</option>
              <option>Night</option>
              <option>Graveyard</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Incident Date & Time</label>
            <input 
              type="datetime-local" 
              style={inputStyle} 
              onChange={(e) => setFormData({...formData, incident_datetime: e.target.value})} 
              required 
            />
          </div>
        </div>

        {/* Row 3: Type and Severity */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={labelStyle}>Incident Type</label>
            <select style={inputStyle} value={formData.incident_type} onChange={(e) => setFormData({...formData, incident_type: e.target.value})}>
              <option>Slip/Fall</option>
              <option>Strain/Sprain</option>
              <option>Cut/Laceration</option>
              <option>Burn</option>
              <option>Chemical Exposure</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Severity Level</label>
            <select style={inputStyle} value={formData.severity} onChange={(e) => setFormData({...formData, severity: e.target.value})}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </div>
        </div>

        <label style={labelStyle}>Detailed Description</label>
        <textarea 
          style={{...inputStyle, height: '80px', resize: 'vertical'}} 
          placeholder="Describe exactly what happened..." 
          onChange={(e) => setFormData({...formData, description: e.target.value})} 
        />

        <label style={labelStyle}>Initial Root Cause Assessment</label>
        <input 
          type="text" 
          style={inputStyle} 
          placeholder="e.g. Missing wet floor sign, improper lifting technique"
          onChange={(e) => setFormData({...formData, root_cause: e.target.value})} 
        />

        <div style={{ display: 'flex', gap: '40px', marginBottom: '30px', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px' }}>
            <input type="checkbox" checked={formData.ppe_worn} onChange={(e) => setFormData({...formData, ppe_worn: e.target.checked})} />
            Was PPE being used?
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px' }}>
            <input type="checkbox" checked={formData.hospitalized} onChange={(e) => setFormData({...formData, hospitalized: e.target.checked})} />
            Immediate Hospitalization?
          </label>
        </div>

        <button type="submit" style={{ width: '100%', backgroundColor: '#d4af37', color: '#fff', padding: '18px', border: 'none', borderRadius: '30px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', transition: 'background 0.3s' }}>
          LOG INCIDENT
        </button>
      </form>
    </div>
  );
}

export default ReportIncident;