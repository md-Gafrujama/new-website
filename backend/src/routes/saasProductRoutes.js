const express = require('express');
const router = express.Router();
const {
  submitSaaSProductRequest,
  getAllSaaSProductRequests,
  getSaaSProductRequestById,
  updateSaaSProductRequestStatus
} = require('../controllers/saasProductController');

router.post('/', submitSaaSProductRequest);
router.get('/', getAllSaaSProductRequests);
router.get('/:id', getSaaSProductRequestById);
router.patch('/:id/status', updateSaaSProductRequestStatus);

module.exports = router;
