const express = require('express');
const router = express.Router();
const {
  submitCloudHostingRequest,
  getAllCloudHostingRequests,
  getCloudHostingRequestById,
  updateCloudHostingRequestStatus,
  getCloudHostingStatistics,
  deleteCloudHostingRequest
} = require('../controllers/cloudHostingController');

// Submit new cloud hosting request
router.post('/', submitCloudHostingRequest);

// Get all cloud hosting requests
router.get('/', getAllCloudHostingRequests);

// Get statistics
router.get('/stats/overview', getCloudHostingStatistics);

// Get specific cloud hosting request by ID
router.get('/:id', getCloudHostingRequestById);

// Update cloud hosting request status
router.patch('/:id/status', updateCloudHostingRequestStatus);

// Delete a specific cloud hosting request
router.delete('/:id', deleteCloudHostingRequest);

module.exports = router;
