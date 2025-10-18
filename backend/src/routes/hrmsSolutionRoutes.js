const express = require('express');
const router = express.Router();
const {
  submitHrmsSolutionRequest,
  getAllHrmsSolutionRequests,
  getHrmsSolutionRequestById,
  updateHrmsSolutionRequestStatus,
  deleteHrmsSolutionRequest
} = require('../controllers/hrmsSolutionController');

router.post('/', submitHrmsSolutionRequest);
router.get('/', getAllHrmsSolutionRequests);
router.get('/:id', getHrmsSolutionRequestById);
router.patch('/:id/status', updateHrmsSolutionRequestStatus);
router.delete('/:id', deleteHrmsSolutionRequest); // ✅ Added Delete Route

module.exports = router;
