const express = require('express');
const router = express.Router();
const {
  submitCrmSolutionRequest,
  getAllCrmSolutionRequests,
  getCrmSolutionRequestById,
  updateCrmSolutionRequestStatus,
  getCrmSolutionStatistics
} = require('../controllers/crmSolutionController');

// Submit new CRM solution request
router.post('/', submitCrmSolutionRequest);

// Get all CRM solution requests
router.get('/', getAllCrmSolutionRequests);

// Get statistics
router.get('/stats/overview', getCrmSolutionStatistics);

// Get specific CRM solution request by ID
router.get('/:id', getCrmSolutionRequestById);

// Update CRM solution request status
router.patch('/:id/status', updateCrmSolutionRequestStatus);

module.exports = router;
