const express = require('express');
const router = express.Router();
const {
  submitVideoEditingRequest,
  getAllVideoEditingRequests,
  getVideoEditingRequestById,
  updateVideoEditingRequestStatus,
  deleteVideoEditingRequest
} = require('../controllers/videoEditingController');

router.post('/', submitVideoEditingRequest);
router.get('/', getAllVideoEditingRequests);
router.get('/:id', getVideoEditingRequestById);
router.patch('/:id/status', updateVideoEditingRequestStatus);
router.delete('/:id', deleteVideoEditingRequest);

module.exports = router;
