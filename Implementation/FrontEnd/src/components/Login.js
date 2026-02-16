import React from 'react';

function Login({ onLogin }) {
const containerStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' };
const buttonStyle = { padding: '15px 30px', margin: '10px', fontSize: '18px', cursor: 'pointer', borderRadius: '8px', border: 'none', color: 'white' };

return (
<div style={containerStyle}>
<h1>SafeSight Authentication</h1>
<p>Select your role for the Fairmont Waterfront simulation:</p>
<div>
<button style={{ ...buttonStyle, backgroundColor: '#3498db' }} onClick={() => onLogin('manager')}>
Login as Department Manager
</button>
<button style={{ ...buttonStyle, backgroundColor: '#9b59b6' }} onClick={() => onLogin('hr')}>
Login as HR Personnel
</button>
</div>
</div>
);
}

export default Login;