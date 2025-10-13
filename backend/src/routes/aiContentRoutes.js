const express = require('express');
const router = express.Router();
const {
  submitAiContentRequest,
  getAllAiContentRequests,
  getAiContentRequestById,
  updateAiContentRequestStatus
} = require('../controllers/aiContentController');

router.post('/', submitAiContentRequest);
router.get('/', getAllAiContentRequests);
router.get('/:id', getAiContentRequestById);
router.patch('/:id/status', updateAiContentRequestStatus);

module.exports = router;
