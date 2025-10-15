const express = require('express');
const router = express.Router();
const {
  submitEcommerceProjectRequest,
  getAllEcommerceProjectRequests,
  getEcommerceProjectRequestById,
  updateEcommerceProjectRequestStatus
} = require('../controllers/ecommerceProjectController');

router.post('/', submitEcommerceProjectRequest);
router.get('/', getAllEcommerceProjectRequests);
router.get('/:id', getEcommerceProjectRequestById);
router.patch('/:id/status', updateEcommerceProjectRequestStatus);

module.exports = router;
