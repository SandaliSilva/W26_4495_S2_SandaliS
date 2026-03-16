import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WorkSafeBCExport = () => {
  const [incidents, setIncidents] = useState([]);
  const [loadingId, setLoadingId] = useState(null); 
  const [isExportingExcel, setIsExportingExcel] = useState(false); // State for Bulk Export

  // 1. Fetch incidents from the updated MySQL route
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/incidents'); 
        setIncidents(res.data); 
      } catch (err) {
        console.error("Error fetching incidents:", err);
      }
    };
    fetchIncidents();
  }, []);

  // 2. Handle the Binary PDF Download (Individual)
  const handleDownload = async (incident_id) => {
    setLoadingId(incident_id);
    try {
      const response = await axios({
        url: `http://localhost:5000/api/reports/generate/${incident_id}`,
        method: 'GET',
        responseType: 'blob', 
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `WorkSafeBC_EIIR_ID_${incident_id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to generate PDF.");
    } finally {
      setLoadingId(null);
    }
  };

  // 3. Handle Bulk Excel Export (Full Dataset)
  const handleExcelExport = async () => {
    setIsExportingExcel(true);
    try {
      const response = await axios({
        url: 'http://localhost:5000/api/reports/export-excel',
        method: 'GET',
        responseType: 'blob', // Critical for .xlsx binary files
      });

      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `SafeSight_Full_Export_${new Date().toLocaleDateString()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Excel Export failed:", error);
      alert("Failed to export Excel file. Ensure the backend route is ready.");
    } finally {
      setIsExportingExcel(false);
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif' }}>
      {/* HEADER SECTION WITH FLEXBOX */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '20px' 
      }}>
        <div>
          <h2 style={{ color: '#2c3e50', margin: '0 0 5px 0' }}>Compliance Automation: WorkSafeBC Export</h2>
          <p style={{ color: '#7f8c8d', margin: 0 }}>
            Automated data-mapping for official EIIR templates and bulk dataset analysis.
          </p>
        </div>

        <button 
          onClick={handleExcelExport}
          disabled={isExportingExcel}
          style={{ 
            background: isExportingExcel ? '#95a5a6' : '#27ae60', 
            color: 'white', 
            border: 'none', 
            padding: '12px 20px', 
            borderRadius: '5px', 
            cursor: isExportingExcel ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            transition: '0.2s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          {isExportingExcel ? 'Exporting...' : '📊 Export All to Excel'}
        </button>
      </div>
      
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