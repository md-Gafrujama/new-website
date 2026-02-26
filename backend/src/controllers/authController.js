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
      const normalizedEmail = email.toLowerCase().trim();

      // Restrict admin access to allowed email only (if ALLOWED_ADMIN_EMAIL is set)
      const allowedEmail = process.env.ALLOWED_ADMIN_EMAIL?.trim().toLowerCase();
      if (allowedEmail && normalizedEmail !== allowedEmail) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. This email is not authorized for admin login.'
        });
      }

      // Check if admin exists
      const admin = await Admin.findOne({ 
        email: normalizedEmail, 
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
      await OTP.deleteMany({ email: normalizedEmail });

      // Generate new OTP
      const otpCode = OTP.generateSecureOTP();
      
      // Save OTP to database
      const newOTP = new OTP({
        email: normalizedEmail,
        otp: otpCode,
        purpose: 'login',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });
      await newOTP.save();

      // Send OTP via email
      let emailResult;
      try {
        emailResult = await emailService.sendOTPEmail(
          email, 
          otpCode, 
          'login'
        );

        if (!emailResult.success) {
          throw new Error('Failed to send OTP email');
        }
      } catch (emailError) {
        console.error('Email sending error in sendOTP:', emailError);
        console.error('Full error details:', {
          message: emailError.message,
          code: emailError.code,
          response: emailError.response,
          stack: process.env.NODE_ENV === 'development' ? emailError.stack : undefined
        });
        
        // Check if it's an authentication error
        const isAuthError = emailError.code === 'EAUTH' || 
                           emailError.message.includes('Username and Password not accepted') ||
                           emailError.message.includes('535-5.7.8');
        
        // DEVELOPMENT MODE: If email fails, log OTP to console for testing
        if (process.env.NODE_ENV === 'development' && process.env.ALLOW_CONSOLE_OTP === 'true') {
          console.log('\n⚠️  DEVELOPMENT MODE: Email sending failed, but OTP is logged below for testing');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log(`📧 Email: ${email}`);
          console.log(`🔐 OTP Code: ${otpCode}`);
          console.log(`⏰ Expires in: ${process.env.OTP_EXPIRY_MINUTES || 5} minutes`);
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('💡 To use this OTP, enter it in the login form');
          console.log('💡 To fix email: Generate new App Password and update EMAIL_PASSWORD in .env\n');
          
          // Return success with OTP in response (development only)
          return res.status(200).json({
            success: true,
            message: 'OTP generated (email failed, but OTP logged to console for testing)',
            data: {
              email: email.toLowerCase(),
              expiresIn: process.env.OTP_EXPIRY_MINUTES || 5,
              otp: otpCode, // Include OTP in response for development
              warning: 'Email sending failed. OTP is shown here for testing only.',
              emailError: emailError.message,
              hint: 'Check backend console for OTP code. Fix Gmail configuration to enable email delivery.'
            }
          });
        }
        
        return res.status(500).json({
          success: false,
          message: isAuthError 
            ? 'Gmail authentication failed. Please check your App Password in .env file.'
            : 'Failed to send OTP email. Please check email service configuration.',
          error: process.env.NODE_ENV === 'development' ? emailError.message : undefined,
          errorCode: process.env.NODE_ENV === 'development' ? emailError.code : undefined,
          hint: isAuthError
            ? 'Generate a new Gmail App Password at https://myaccount.google.com/apppasswords and update EMAIL_PASSWORD in .env'
            : 'Check EMAIL_USER and EMAIL_PASSWORD in .env file. Run "node test-email.js" to test configuration.',
          developmentTip: process.env.NODE_ENV === 'development' 
            ? 'Add ALLOW_CONSOLE_OTP=true to .env to log OTP to console when email fails'
            : undefined,
          troubleshooting: process.env.NODE_ENV === 'development' ? {
            step1: 'Go to https://myaccount.google.com/apppasswords',
            step2: 'Generate a new App Password (16 characters)',
            step3: 'Update backend/.env: EMAIL_PASSWORD=your_new_password',
            step4: 'Restart backend server',
            step5: 'Test with: node test-email.js',
            step6: 'OR add ALLOW_CONSOLE_OTP=true to .env for console OTP logging'
          } : undefined
        });
      }

      res.status(200).json({
        success: true,
        message: 'OTP sent to your email. Check inbox and spam folder.',
        data: {
          email: email.toLowerCase(),
          expiresIn: parseInt(process.env.OTP_EXPIRY_MINUTES, 10) || 5,
          messageId: emailResult.messageId,
          timestamp: new Date().toISOString(),
          deliveredByEmail: true
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
      // For now, just send success response (only once)
      if (res.headersSent) return;
      return res.status(200).json({
        success: true,
        message: 'Logout successful',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Logout error:', error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Logout failed'
        });
      }
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
