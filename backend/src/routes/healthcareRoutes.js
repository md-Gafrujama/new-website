const express = require('express');
const router = express.Router();
const {
  submitHealthcareRequest,
  getAllHealthcareRequests,
  getHealthcareRequestById,
  updateHealthcareRequestStatus,
  deleteHealthcareRequest
} = require('../controllers/healthcareController');

router.post('/', submitHealthcareRequest);
router.get('/', getAllHealthcareRequests);
router.get('/:id', getHealthcareRequestById);
router.patch('/:id/status', updateHealthcareRequestStatus);
router.delete('/:id', deleteHealthcareRequest); // ✅ Added delete route

module.exports = router;
