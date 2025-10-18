const express = require('express');
const router = express.Router();
const {
  submitAiContentRequest,
  getAllAiContentRequests,
  getAiContentRequestById,
  updateAiContentRequestStatus,
  deleteAiContentRequest
} = require('../controllers/aiContentController');

// Submit new AI content request
router.post('/', submitAiContentRequest);

// Get all AI content requests
router.get('/', getAllAiContentRequests);

// Get specific AI content request by ID
router.get('/:id', getAiContentRequestById);

// Update AI content request status
router.patch('/:id/status', updateAiContentRequestStatus);

// Delete specific AI content request
router.delete('/:id', deleteAiContentRequest);

module.exports = router;
