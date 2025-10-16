const express = require('express');
const router = express.Router();
const {
  submitMobileAppRequest,
  getAllMobileAppRequests,
  getMobileAppRequestById,
  updateMobileAppRequestStatus,
   deleteMobileAppRequest
} = require('../controllers/mobileAppRequestController');

// Submit new mobile app request
router.post('/', submitMobileAppRequest);

// Get all mobile app requests
router.get('/', getAllMobileAppRequests);

// Get specific mobile app request by ID
router.get('/:id', getMobileAppRequestById);

// Update mobile app request status
router.patch('/:id/status', updateMobileAppRequestStatus);

router.delete('/:id', deleteMobileAppRequest);
module.exports = router;
