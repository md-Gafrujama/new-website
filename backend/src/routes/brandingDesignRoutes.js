const express = require('express');
const router = express.Router();
const {
  submitBrandingDesignRequest,
  getAllBrandingDesignRequests,
  getBrandingDesignRequestById,
  updateBrandingDesignRequestStatus,
  deleteBrandingDesignRequest // ✅ import delete
} = require('../controllers/brandingDesignController');

router.post('/', submitBrandingDesignRequest);
router.get('/', getAllBrandingDesignRequests);
router.get('/:id', getBrandingDesignRequestById);
router.patch('/:id/status', updateBrandingDesignRequestStatus);
router.delete('/:id', deleteBrandingDesignRequest); // ✅ new delete route

module.exports = router;
