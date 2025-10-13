const express = require('express');
const router = express.Router();

// Simple test route
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Mobile app requests endpoint working',
    timestamp: new Date().toISOString()
  });
});

// Test POST route
router.post('/', (req, res) => {
  res.json({
    success: true,
    message: 'Mobile app request received (test mode)',
    data: req.body,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
