const express = require('express');
const cors = require('cors');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Mount the routes
app.use('/api', analyticsRoutes);

app.get('/', (req, res) => {
    res.send('SafeSight Backend is running!');
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
});