const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// This route will be: http://localhost:5000/api/reports/generate/12345
router.get('/generate/:id', reportController.generateWSBCReport);

module.exports = router;