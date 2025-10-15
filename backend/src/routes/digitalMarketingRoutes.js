const express = require('express');
const router = express.Router();
const {
  submitDigitalMarketingRequest,
  getAllDigitalMarketingRequests,
  getDigitalMarketingRequestById,
  updateDigitalMarketingRequestStatus,
  getDigitalMarketingStatistics
} = require('../controllers/digitalMarketingController');

// Submit new digital marketing request
router.post('/', submitDigitalMarketingRequest);

// Get all digital marketing requests
router.get('/', getAllDigitalMarketingRequests);

// Get statistics
router.get('/stats/overview', getDigitalMarketingStatistics);

// Get specific digital marketing request by ID
router.get('/:id', getDigitalMarketingRequestById);

// Update digital marketing request status
router.patch('/:id/status', updateDigitalMarketingRequestStatus);

module.exports = router;
