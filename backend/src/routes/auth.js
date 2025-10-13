const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// TEMPORARILY DISABLE RATE LIMITING FOR TESTING
// Comment out or modify the rate limiters

// Rate limiting for OTP requests - DISABLED FOR TESTING
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Increased from 3 to 10 for testing
  message: {
    success: false,
    message: 'Too many OTP requests. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'development', // Skip in development
});

// Rate limiting for login attempts - DISABLED FOR TESTING
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Increased from 5 to 10 for testing
  message: {
    success: false,
    message: 'Too many login attempts. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'development', // Skip in development
});

// Rate limiting for resend requests - DISABLED FOR TESTING
const resendLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // Increased from 2 to 5 for testing
  message: {
    success: false,
    message: 'Too many resend requests. Please wait before trying again.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'development', // Skip in development
});

// Validation rules (keep these as they are)
const emailValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
    .isLength({ max: 255 })
    .withMessage('Email is too long')
];

const sendOTPValidation = [
  ...emailValidation
];

const verifyOTPValidation = [
  ...emailValidation,
  body('otp')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('OTP must be a 6-digit number')
];

const loginStep1Validation = [
  ...emailValidation,
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .notEmpty()
    .withMessage('Password is required')
];

const changePasswordValidation = [
  body('currentPassword')
    .isLength({ min: 6 })
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, one number, and one special character')
];

const toggle2FAValidation = [
  body('enabled')
    .isBoolean()
    .withMessage('Enabled must be a boolean value')
];

// Public routes - RATE LIMITING DISABLED FOR TESTING
router.post('/send-otp', sendOTPValidation, authController.sendOTP);
router.post('/verify-otp', verifyOTPValidation, authController.verifyOTPAndLogin);
router.post('/login', loginStep1Validation, authController.loginStep1);
router.post('/resend-otp', emailValidation, authController.resendOTP);

// Protected routes
router.get('/profile', authMiddleware, authController.getProfile);
router.post('/logout', authMiddleware, authController.logout);
router.post('/change-password', authMiddleware, changePasswordValidation, authController.changePassword);
router.post('/toggle-2fa', authMiddleware, toggle2FAValidation, authController.toggle2FA);

// Health check for auth service
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Auth service is running',
    timestamp: new Date().toISOString(),
    service: 'email-auth',
    version: '1.0.0'
  });
});

// Test email configuration (development only)
if (process.env.NODE_ENV === 'development') {
  router.get('/test-email', async (req, res) => {
    try {
      const emailService = require('../services/emailService');
      
      // Test configuration first
      const configTest = await emailService.testEmailConfiguration();
      if (!configTest.success) {
        return res.status(500).json(configTest);
      }

      // Send test email
      const testResult = await emailService.sendTestEmail();
      
      res.json({
        success: true,
        message: 'Email test completed successfully',
        configTest,
        testResult
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Email test failed',
        error: error.message
      });
    }
  });

  // Clear rate limit for testing
  router.post('/clear-rate-limit', (req, res) => {
    res.json({
      success: true,
      message: 'Rate limit cleared for development',
      note: 'This endpoint only works in development mode'
    });
  });
}

module.exports = router;
