const express = require('express');
const router = express.Router();
const {
  submitSaaSProductRequest,
  getAllSaaSProductRequests,
  getSaaSProductRequestById,
  updateSaaSProductRequestStatus,
  deleteSaaSProductRequest
} = require('../controllers/saasProductController');

router.post('/', submitSaaSProductRequest);
router.get('/', getAllSaaSProductRequests);
router.get('/:id', getSaaSProductRequestById);
router.patch('/:id/status', updateSaaSProductRequestStatus);
router.delete('/:id', deleteSaaSProductRequest); // ✅ new delete route

module.exports = router;
