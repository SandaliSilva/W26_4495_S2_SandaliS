import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard({ role }) {
const [incidents, setIncidents] = useState([]);

useEffect(() => {
axios.get('http://localhost:5000/api/incidents')
.then(res => setIncidents(res.data))
.catch(err => console.error(err));
}, []);

return (
<div>
<h2>{role.toUpperCase()} Safety Dashboard</h2>
<div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', border: '1px solid #ddd' }}>
<h4>Active Incident Log</h4>
<table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
<thead>
<tr style={{ borderBottom: '2px solid #eee' }}>
<th>ID</th><th>Dept</th><th>Type</th><th>Severity</th>
</tr>
</thead>
<tbody>
{incidents.map(i => (
<tr key={i.incident_id} style={{ borderBottom: '1px solid #eee' }}>
<td>{i.incident_id}</td><td>{i.department}</td><td>{i.incident_type}</td><td>{i.severity}</td>
</tr>
))}
</tbody>
</table>
</div>
</div>
);
}

export default Dashboard;