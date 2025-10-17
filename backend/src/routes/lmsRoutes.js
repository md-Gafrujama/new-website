const express = require('express');
const router = express.Router();
const {
  submitLmsRequest,
  getAllLmsRequests,
  getLmsRequestById,
  updateLmsRequestStatus,
  deleteLmsRequest
} = require('../controllers/lmsController');

router.post('/', submitLmsRequest);
router.get('/', getAllLmsRequests);
router.get('/:id', getLmsRequestById);
router.patch('/:id/status', updateLmsRequestStatus);
router.delete('/:id', deleteLmsRequest); // ✅ New delete route

module.exports = router;
