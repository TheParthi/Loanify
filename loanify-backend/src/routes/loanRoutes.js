const express = require('express');
const loanController = require('../controllers/loanController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Customer routes
router.post('/apply', authenticateToken, loanController.submitApplication);
router.get('/status/:applicationId', authenticateToken, loanController.getApplicationStatus);
router.get('/my-applications', authenticateToken, loanController.getUserApplications);

// Admin routes
router.get('/admin/dashboard', authenticateToken, requireAdmin, loanController.getAdminDashboard);

module.exports = router;