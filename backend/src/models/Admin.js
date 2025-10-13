const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    maxlength: [255, 'Email cannot exceed 255 characters']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  firstName: {
    type: String,
    trim: true,
    default: 'Admin',
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    trim: true,
    default: 'User',
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  role: {
    type: String,
    enum: ['admin', 'super-admin'],
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },
  loginAttempts: {
    type: Number,
    default: 0,
    min: 0
  },
  lockUntil: {
    type: Date
  },
  twoFactorEnabled: {
    type: Boolean,
    default: true
  },
  // Additional security fields
  otpCode: {
    type: String,
    default: null
  },
  otpExpiry: {
    type: Date,
    default: null
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpiry: {
    type: Date,
    default: null
  },
  // Session tracking
  sessionTokens: [{
    token: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: Date,
    device: String,
    ipAddress: String,
    userAgent: String
  }],
  // Audit trail
  lastPasswordChange: {
    type: Date,
    default: Date.now
  },
  loginHistory: [{
    loginTime: {
      type: Date,
      default: Date.now
    },
    ipAddress: String,
    userAgent: String,
    success: {
      type: Boolean,
      default: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for performance
adminSchema.index({ email: 1 });
adminSchema.index({ resetPasswordToken: 1 });
adminSchema.index({ otpCode: 1 });
adminSchema.index({ 'sessionTokens.token': 1 });
adminSchema.index({ 'sessionTokens.expiresAt': 1 });

// Virtual for account locking
adminSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Virtual for full name
adminSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`.trim();
});

// Virtual for time since last login
adminSchema.virtual('timeSinceLastLogin').get(function() {
  if (!this.lastLogin) return 'Never logged in';
  
  const now = new Date();
  const diffMs = now - this.lastLogin;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffDays > 0) return `${diffDays} days ago`;
  if (diffHours > 0) return `${diffHours} hours ago`;
  if (diffMinutes > 0) return `${diffMinutes} minutes ago`;
  return 'Just now';
});

// Pre-save middleware for password hashing
adminSchema.pre('save', async function(next) {
  this.updatedAt = new Date();
  
  // Hash password if it's modified
  if (this.isModified('password')) {
    try {
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
      const salt = await bcrypt.genSalt(saltRounds);
      this.password = await bcrypt.hash(this.password, salt);
      this.lastPasswordChange = new Date();
      console.log(`🔐 Password hashed for admin: ${this.email}`);
    } catch (error) {
      return next(error);
    }
  }
  
  next();
});

// Compare password method (your existing method)
adminSchema.methods.comparePassword = async function(candidatePassword) {
  if (this.isLocked) {
    throw new Error('Account is temporarily locked');
  }
  return bcrypt.compare(candidatePassword, this.password);
};

// Increment login attempts (your existing method)
adminSchema.methods.incLoginAttempts = async function() {
  const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5;
  const lockTime = parseInt(process.env.LOCK_TIME_MINUTES) || 30;
  const lockTimeMs = lockTime * 60 * 1000;

  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: {
        loginAttempts: 1,
        lockUntil: 1
      }
    });
  }

  const updates = { 
    $inc: { loginAttempts: 1 },
    $set: { updatedAt: new Date() }
  };

  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
    updates.$set.lockUntil = Date.now() + lockTimeMs;
    console.log(`🔒 Account locked for ${lockTime} minutes: ${this.email}`);
  }

  return this.updateOne(updates);
};

// Reset login attempts (your existing method)
adminSchema.methods.resetLoginAttempts = async function() {
  return this.updateOne({
    $unset: {
      loginAttempts: 1,
      lockUntil: 1
    },
    $set: {
      lastLogin: new Date(),
      updatedAt: new Date()
    }
  });
};

// NEW METHODS - Additional functionality

// Generate OTP for two-factor authentication
adminSchema.methods.generateOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  const otpExpiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES) || 5;
  
  this.otpCode = otp;
  this.otpExpiry = new Date(Date.now() + otpExpiryMinutes * 60 * 1000);
  
  return otp;
};

// Verify OTP
adminSchema.methods.verifyOTP = function(candidateOTP) {
  if (!this.otpCode || !this.otpExpiry) {
    return false;
  }
  
  if (this.otpExpiry < Date.now()) {
    return false; // OTP expired
  }
  
  return this.otpCode === candidateOTP;
};

// Clear OTP after verification
adminSchema.methods.clearOTP = async function() {
  return this.updateOne({
    $unset: {
      otpCode: 1,
      otpExpiry: 1
    },
    $set: {
      updatedAt: new Date()
    }
  });
};

// Add session token
adminSchema.methods.addSessionToken = async function(token, device, ipAddress, userAgent) {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  this.sessionTokens.push({
    token,
    device: device || 'Unknown',
    ipAddress: ipAddress || 'Unknown',
    userAgent: userAgent || 'Unknown',
    expiresAt
  });
  
  // Keep only last 10 sessions
  if (this.sessionTokens.length > 10) {
    this.sessionTokens = this.sessionTokens.slice(-10);
  }
  
  return this.save();
};

// Remove session token
adminSchema.methods.removeSessionToken = async function(token) {
  this.sessionTokens = this.sessionTokens.filter(session => session.token !== token);
  return this.save();
};

// Clean expired session tokens
adminSchema.methods.cleanExpiredSessions = async function() {
  const now = new Date();
  this.sessionTokens = this.sessionTokens.filter(session => session.expiresAt > now);
  return this.save();
};

// Add login history entry
adminSchema.methods.addLoginHistory = async function(ipAddress, userAgent, success = true) {
  this.loginHistory.push({
    loginTime: new Date(),
    ipAddress: ipAddress || 'Unknown',
    userAgent: userAgent || 'Unknown',
    success
  });
  
  // Keep only last 50 login attempts
  if (this.loginHistory.length > 50) {
    this.loginHistory = this.loginHistory.slice(-50);
  }
  
  return this.save();
};

// Check if password needs to be changed (e.g., older than 90 days)
adminSchema.methods.isPasswordExpired = function() {
  const passwordAge = Date.now() - this.lastPasswordChange.getTime();
  const maxAge = parseInt(process.env.PASSWORD_MAX_AGE_DAYS) || 90;
  return passwordAge > (maxAge * 24 * 60 * 60 * 1000);
};

// Generate password reset token
adminSchema.methods.generatePasswordResetToken = function() {
  const resetToken = require('crypto').randomBytes(32).toString('hex');
  const resetExpiryHours = parseInt(process.env.RESET_TOKEN_EXPIRY_HOURS) || 1;
  
  this.resetPasswordToken = resetToken;
  this.resetPasswordExpiry = new Date(Date.now() + resetExpiryHours * 60 * 60 * 1000);
  
  return resetToken;
};

// Verify password reset token
adminSchema.methods.verifyPasswordResetToken = function(token) {
  if (!this.resetPasswordToken || !this.resetPasswordExpiry) {
    return false;
  }
  
  if (this.resetPasswordExpiry < Date.now()) {
    return false; // Token expired
  }
  
  return this.resetPasswordToken === token;
};

// Clear password reset token
adminSchema.methods.clearPasswordResetToken = async function() {
  return this.updateOne({
    $unset: {
      resetPasswordToken: 1,
      resetPasswordExpiry: 1
    },
    $set: {
      updatedAt: new Date()
    }
  });
};

// JSON transform (your existing method with enhancements)
adminSchema.methods.toJSON = function() {
  const admin = this.toObject({ virtuals: true });
  
  // Remove sensitive fields
  delete admin.password;
  delete admin.loginAttempts;
  delete admin.lockUntil;
  delete admin.otpCode;
  delete admin.otpExpiry;
  delete admin.resetPasswordToken;
  delete admin.resetPasswordExpiry;
  delete admin.sessionTokens;
  delete admin.loginHistory;
  delete admin.__v;
  
  return admin;
};

// Static method to find admin by email with security checks
adminSchema.statics.findByEmailWithSecurity = async function(email) {
  const admin = await this.findOne({ email: email.toLowerCase() });
  
  if (!admin) {
    return null;
  }
  
  // Clean expired sessions
  await admin.cleanExpiredSessions();
  
  return admin;
};

// Static method to cleanup inactive accounts
adminSchema.statics.cleanupInactiveAccounts = async function() {
  const inactiveDays = parseInt(process.env.INACTIVE_ACCOUNT_DAYS) || 90;
  const cutoffDate = new Date(Date.now() - inactiveDays * 24 * 60 * 60 * 1000);
  
  const result = await this.updateMany(
    { 
      lastLogin: { $lt: cutoffDate },
      isActive: true,
      role: 'admin' // Don't auto-deactivate super-admins
    },
    { 
      $set: { 
        isActive: false,
        updatedAt: new Date()
      }
    }
  );
  
  console.log(`🧹 Cleaned up ${result.modifiedCount} inactive admin accounts`);
  return result;
};

// Static method to get security stats
adminSchema.statics.getSecurityStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalAdmins: { $sum: 1 },
        activeAdmins: {
          $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
        },
        lockedAdmins: {
          $sum: { 
            $cond: [
              { 
                $and: [
                  { $ne: ['$lockUntil', null] },
                  { $gt: ['$lockUntil', new Date()] }
                ]
              }, 
              1, 
              0
            ] 
          }
        },
        adminsWithTwoFA: {
          $sum: { $cond: [{ $eq: ['$twoFactorEnabled', true] }, 1, 0] }
        }
      }
    }
  ]);
  
  return stats[0] || {
    totalAdmins: 0,
    activeAdmins: 0,
    lockedAdmins: 0,
    adminsWithTwoFA: 0
  };
};

module.exports = mongoose.model('Admin', adminSchema);
