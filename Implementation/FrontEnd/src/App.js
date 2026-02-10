import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [incidents, setIncidents] = useState([]);

  // Fetch data from your Backend (Port 5000)
  useEffect(() => {
    axios.get('http://localhost:5000/api/incidents')
      .then(response => {
        setIncidents(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the incidents!", error);
      });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>SafeSight: Safety Incident Dashboard</h1>
      <h3>Fairmont Waterfront - Phase 2 Initial View</h3>
      
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>ID</th>
            <th>Department</th>
            <th>Type</th>
            <th>Severity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map(incident => (
            <tr key={incident.incident_id}>
              <td>{incident.incident_id}</td>
              <td>{incident.department}</td>
              <td>{incident.incident_type}</td>
              <td>{incident.severity}</td>
              <td>{incident.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;