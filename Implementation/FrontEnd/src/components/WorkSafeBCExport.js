import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WorkSafeBCExport = () => {
  const [incidents, setIncidents] = useState([]);
  const [loadingId, setLoadingId] = useState(null); // Track which PDF is being generated

  // 1. Fetch incidents from the updated MySQL route
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        // This route must return 'incident_id' as part of the data
        const res = await axios.get('http://localhost:5000/api/incidents'); 
        setIncidents(res.data); 
      } catch (err) {
        console.error("Error fetching incidents:", err);
      }
    };
    fetchIncidents();
  }, []);

  // 2. Handle the Binary PDF Download
  const handleDownload = async (incident_id) => {
    setLoadingId(incident_id); // Start loading state
    try {
      const response = await axios({
        // Updated URL to include the /api/ prefix as per your server.js
        url: `http://localhost:5000/api/reports/generate/${incident_id}`,
        method: 'GET',
        responseType: 'blob', // CRITICAL for handling PDF binary data
      });

      // Create a Blob from the PDF stream
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Create hidden link to trigger browser download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `WorkSafeBC_EIIR_ID_${incident_id}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup memory
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to generate PDF. Ensure the backend server is running and the template exists.");
    } finally {
      setLoadingId(null); // End loading state
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#2c3e50' }}>Compliance Automation: WorkSafeBC Export</h2>
      <p style={{ color: '#7f8c8d' }}>
        Automated data-mapping for official EIIR (Employer Incident Investigation Report) templates.
      </p>
      
      <div style={{ marginTop: '20px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr style={{ background: '#2c3e50', color: 'white', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>Incident ID</th>
              <th>Incident Type</th>
              <th>Date Reported</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {incidents.length > 0 ? (
              incidents.map((incident) => (
                <tr key={incident.incident_id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>#{incident.incident_id}</td>
                  <td>{incident.incident_type}</td>
                  <td>{new Date(incident.incident_datetime).toLocaleDateString()}</td>
                  <td>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      fontSize: '12px', 
                      background: incident.status === 'Open' ? '#fff3cd' : '#d4edda',
                      color: incident.status === 'Open' ? '#856404' : '#155724'
                    }}>
                      {incident.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleDownload(incident.incident_id)}
                      disabled={loadingId === incident.incident_id}
                      style={{ 
                        cursor: loadingId === incident.incident_id ? 'not-allowed' : 'pointer', 
                        background: loadingId === incident.incident_id ? '#95a5a6' : '#d32f2f', 
                        color: 'white', 
                        border: 'none', 
                        padding: '8px 15px', 
                        borderRadius: '4px',
                        transition: '0.3s'
                      }}
                    >
                      {loadingId === incident.incident_id ? 'Generating...' : 'Generate PDF'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                  No incidents found. Please log an incident first.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkSafeBCExport;