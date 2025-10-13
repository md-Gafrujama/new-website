const Admin = require('../models/Admin');
const OTP = require('../models/OTP');
const emailService = require('../services/emailService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

class AuthController {
  // Send OTP for login
  async sendOTP(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: errors.array()
        });
      }

      const { email } = req.body;

      // Check if admin exists
      const admin = await Admin.findOne({ 
        email: email.toLowerCase(), 
        isActive: true 
      });
      
      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized access. Admin not found.'
        });
      }

      // Check if account is locked
      if (admin.isLocked) {
        return res.status(423).json({
          success: false,
          message: 'Account is temporarily locked due to multiple failed attempts'
        });
      }

      // Delete any existing OTP for this email
      await OTP.deleteMany({ email: email.toLowerCase() });

      // Generate new OTP
      const otpCode = OTP.generateSecureOTP();
      
      // Save OTP to database
      const newOTP = new OTP({
        email: email.toLowerCase(),
        otp: otpCode,
        purpose: 'login',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });
      await newOTP.save();

      // Send OTP via email
      const emailResult = await emailService.sendOTPEmail(
        email, 
        otpCode, 
        'login'
      );

      if (!emailResult.success) {
        throw new Error('Failed to send OTP email');
      }

      res.status(200).json({
        success: true,
        message: 'OTP sent successfully to your email',
        data: {
          email: email.toLowerCase(),
          expiresIn: process.env.OTP_EXPIRY_MINUTES || 5,
          messageId: emailResult.messageId,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Send OTP error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send OTP',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Verify OTP and login
  async verifyOTPAndLogin(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: errors.array()
        });
      }

      const { email, otp } = req.body;

      // Find admin
      const admin = await Admin.findOne({ 
        email: email.toLowerCase(), 
        isActive: true 
      });
      
      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized access'
        });
      }

      // Find OTP record
      const otpRecord = await OTP.findOne({ 
        email: email.toLowerCase(), 
        purpose: 'login',
        verified: false,
        expiresAt: { $gt: new Date() }
      }).sort({ createdAt: -1 });

      if (!otpRecord) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired OTP'
        });
      }

      // Verify OTP
      try {
        await otpRecord.verifyOTP(otp);
      } catch (error) {
        // Increment login attempts on failed OTP
        await admin.incLoginAttempts();
        
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      // Reset login attempts on successful login
      await admin.resetLoginAttempts();

      // Generate JWT token
      const token = jwt.sign(
        { 
          adminId: admin._id,
          email: admin.email,
          role: admin.role,
          loginTime: new Date().toISOString()
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '24h' }
      );

      // Generate refresh token
      const refreshToken = jwt.sign(
        { adminId: admin._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
      );

      // Remove sensitive data from response
      const adminData = admin.toJSON();

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          admin: adminData,
          token,
          refreshToken,
          loginTime: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Verify OTP error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Login with email and password (first step of 2FA)
  async loginStep1(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: errors.array()
        });
      }

      const { email, password } = req.body;

      // Find admin
      const admin = await Admin.findOne({ 
        email: email.toLowerCase(), 
        isActive: true 
      });

      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Check if account is locked
      if (admin.isLocked) {
        return res.status(423).json({
          success: false,
          message: 'Account is temporarily locked'
        });
      }

      // Verify password
      try {
        const isPasswordValid = await admin.comparePassword(password);
        if (!isPasswordValid) {
          await admin.incLoginAttempts();
          return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
          });
        }
      } catch (error) {
        return res.status(423).json({
          success: false,
          message: error.message
        });
      }

      // If 2FA is not enabled, complete login
      if (!admin.twoFactorEnabled) {
        const token = jwt.sign(
          { 
            adminId: admin._id,
            email: admin.email,
            role: admin.role 
          },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRE || '24h' }
        );

        await admin.resetLoginAttempts();

        return res.status(200).json({
          success: true,
          message: 'Login successful',
          data: {
            admin: admin.toJSON(),
            token,
            twoFactorRequired: false
          }
        });
      }

      // Delete any existing OTP
      await OTP.deleteMany({ email: email.toLowerCase() });

      // Generate OTP for 2FA
      const otpCode = OTP.generateSecureOTP();
      
      const newOTP = new OTP({
        email: email.toLowerCase(),
        otp: otpCode,
        purpose: '2fa-verification',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });
      await newOTP.save();

      // Send 2FA OTP
      await emailService.sendOTPEmail(email, otpCode, '2fa-verification');

      res.status(200).json({
        success: true,
        message: 'Password verified. Check your email for 2FA code.',
        data: {
          twoFactorRequired: true,
          email: email.toLowerCase(),
          expiresIn: process.env.OTP_EXPIRY_MINUTES || 5
        }
      });

    } catch (error) {
      console.error('Login step 1 error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Get admin profile
  async getProfile(req, res) {
    try {
      const admin = await Admin.findById(req.admin.adminId);
      
      if (!admin || !admin.isActive) {
        return res.status(404).json({
          success: false,
          message: 'Admin not found'
        });
      }

      res.status(200).json({
        success: true,
        data: { 
          admin: admin.toJSON(),
          lastAccess: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get profile'
      });
    }
  }

  // Logout
  async logout(req, res) {
    try {
      // In production, you might want to blacklist the token
      // For now, just send success response
      res.status(200).json({
        success: true,
        message: 'Logout successful',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
  }

  // Change password
  async changePassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: errors.array()
        });
      }

      const { currentPassword, newPassword } = req.body;

      const admin = await Admin.findById(req.admin.adminId);
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: 'Admin not found'
        });
      }

      // Verify current password
      const isCurrentPasswordValid = await admin.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(
        newPassword, 
        parseInt(process.env.BCRYPT_ROUNDS) || 12
      );
      
      // Update password
      admin.password = hashedNewPassword;
      await admin.save();

      res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });

    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to change password'
      });
    }
  }

  // Resend OTP
  async resendOTP(req, res) {
    try {
      const { email } = req.body;

      // Check rate limiting for resend
      const lastOTP = await OTP.findOne({ 
        email: email.toLowerCase() 
      }).sort({ createdAt: -1 });

      if (lastOTP) {
        const resendDelay = (parseInt(process.env.OTP_RESEND_DELAY_MINUTES) || 1) * 60 * 1000;
        const timeSinceLastOTP = new Date() - lastOTP.createdAt;
        
        if (timeSinceLastOTP < resendDelay) {
          const remainingTime = Math.ceil((resendDelay - timeSinceLastOTP) / 1000);
          return res.status(429).json({
            success: false,
            message: `Please wait ${remainingTime} seconds before requesting a new OTP`,
            remainingTime
          });
        }
      }

      // Delete existing OTP
      await OTP.deleteMany({ email: email.toLowerCase() });

      // Generate new OTP
      const otpCode = OTP.generateSecureOTP();
      
      const newOTP = new OTP({
        email: email.toLowerCase(),
        otp: otpCode,
        purpose: 'login',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });
      await newOTP.save();

      // Send new OTP
      await emailService.sendOTPEmail(email, otpCode, 'login');

      res.status(200).json({
        success: true,
        message: 'New OTP sent successfully',
        data: {
          email: email.toLowerCase(),
          expiresIn: process.env.OTP_EXPIRY_MINUTES || 5
        }
      });

    } catch (error) {
      console.error('Resend OTP error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to resend OTP'
      });
    }
  }

  // Toggle 2FA
  async toggle2FA(req, res) {
    try {
      const { enabled } = req.body;

      const admin = await Admin.findById(req.admin.adminId);
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: 'Admin not found'
        });
      }

      admin.twoFactorEnabled = enabled;
      await admin.save();

      res.status(200).json({
        success: true,
        message: `Two-factor authentication ${enabled ? 'enabled' : 'disabled'} successfully`,
        data: {
          twoFactorEnabled: admin.twoFactorEnabled
        }
      });

    } catch (error) {
      console.error('Toggle 2FA error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update 2FA settings'
      });
    }
  }
}

module.exports = new AuthController();
