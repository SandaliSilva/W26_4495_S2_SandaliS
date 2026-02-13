import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [incidents, setIncidents] = useState([]);
  const [formData, setFormData] = useState({
    department: '',
    incident_type: '',
    severity: 'Low',
    status: 'Open'
  });

  const fetchIncidents = () => {
    axios.get('http://localhost:5000/api/incidents')
      .then(res => setIncidents(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchIncidents(); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/incidents', formData)
      .then(() => {
        alert("Incident Reported!");
        fetchIncidents(); // Refresh the table
        setFormData({ department: '', incident_type: '', severity: 'Low', status: 'Open' });
      });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>SafeSight: Fairmont Waterfront Dashboard</h1>
      
      <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>Report New Incident</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Department" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} required />
          <input type="text" placeholder="Incident Type" value={formData.incident_type} onChange={(e) => setFormData({...formData, incident_type: e.target.value})} required />
          <select value={formData.severity} onChange={(e) => setFormData({...formData, severity: e.target.value})}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <button type="submit">Submit Report</button>
        </form>
      </div>

      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>ID</th><th>Department</th><th>Type</th><th>Severity</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map(i => (
            <tr key={i.incident_id}>
              <td>{i.incident_id}</td><td>{i.department}</td><td>{i.incident_type}</td><td>{i.severity}</td><td>{i.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;