const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// This connects to http://localhost:5000/api/dashboard-stats
router.get('/dashboard-stats', analyticsController.getDashboardStats);

module.exports = router;