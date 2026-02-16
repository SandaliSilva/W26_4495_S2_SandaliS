import React, { useState } from 'react';
import axios from 'axios';

function ReportIncident() {
const [formData, setFormData] = useState({
department: '',
incident_type: '',
severity: 'Low',
status: 'Reported'
});

const handleSubmit = (e) => {
e.preventDefault();
axios.post('http://localhost:5000/api/incidents', formData)
.then(() => {
alert('Incident successfully logged in SafeSight!');
})
.catch(err => {
console.error('Submission error:', err);
alert('Error submitting report.');
});
};

return (
<div style={{ padding: '20px', maxWidth: '400px', margin: 'auto', border: '1px solid #ccc', borderRadius: '8px' }}>
<h2>Log New Incident</h2>
<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
<input
type="text"
placeholder="Department"
onChange={(e) => setFormData({...formData, department: e.target.value})}
required
/>
<input
type="text"
placeholder="Incident Type"
onChange={(e) => setFormData({...formData, incident_type: e.target.value})}
required
/>
<select onChange={(e) => setFormData({...formData, severity: e.target.value})}>
<option value="Low">Low</option>
<option value="Medium">Medium</option>
<option value="High">High</option>
</select>
<button type="submit" style={{ padding: '10px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px' }}>
Submit to SafeSight
</button>
</form>
</div>
);
}

export default ReportIncident;