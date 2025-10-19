const express = require('express');
const router = express.Router();
const {
  submitBrandingDesignRequest,
  getAllBrandingDesignRequests,
  getBrandingDesignRequestById,
  updateBrandingDesignRequestStatus
} = require('../controllers/brandingDesignController');

router.post('/', submitBrandingDesignRequest);
router.get('/', getAllBrandingDesignRequests);
router.get('/:id', getBrandingDesignRequestById);
router.patch('/:id/status', updateBrandingDesignRequestStatus);

module.exports = router;
