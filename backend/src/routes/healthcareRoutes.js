const express = require('express');
const router = express.Router();
const {
  submitHealthcareRequest,
  getAllHealthcareRequests,
  getHealthcareRequestById,
  updateHealthcareRequestStatus
} = require('../controllers/healthcareController');

router.post('/', submitHealthcareRequest);
router.get('/', getAllHealthcareRequests);
router.get('/:id', getHealthcareRequestById);
router.patch('/:id/status', updateHealthcareRequestStatus);

module.exports = router;
