const express = require('express');
const router = express.Router();

const {
  submitWebsiteRequest,
  getAllWebsiteRequests,
  getWebsiteRequestById,
  updateWebsiteRequestStatus,
  deleteWebsiteRequest
} = require('../controllers/websiteRequestController');

const {
  websiteRequestValidation,
  handleValidationErrors
} = require('../middleware/validation');

// Submit new website request
router.post('/', websiteRequestValidation, handleValidationErrors, submitWebsiteRequest);

// Get all website requests
router.get('/', getAllWebsiteRequests);

// Get specific website request by ID
router.get('/:id', getWebsiteRequestById);

// Update website request status
router.patch('/:id/status', updateWebsiteRequestStatus);

// Delete website request by ID
router.delete('/:id', deleteWebsiteRequest); 

module.exports = router;
