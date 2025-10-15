const express = require('express');
const router = express.Router();
const {
  submitLmsRequest,
  getAllLmsRequests,
  getLmsRequestById,
  updateLmsRequestStatus
} = require('../controllers/lmsController');

router.post('/', submitLmsRequest);
router.get('/', getAllLmsRequests);
router.get('/:id', getLmsRequestById);
router.patch('/:id/status', updateLmsRequestStatus);

module.exports = router;
