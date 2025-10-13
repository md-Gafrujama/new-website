const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  otp: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    enum: ['login', 'password-reset', '2fa-verification'],
    default: 'login'
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + (parseInt(process.env.OTP_EXPIRY_MINUTES) || 5) * 60 * 1000)
  },
  attempts: {
    type: Number,
    default: 0,
    max: parseInt(process.env.MAX_OTP_ATTEMPTS) || 3
  },
  verified: {
    type: Boolean,
    default: false
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for automatic deletion
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
otpSchema.index({ email: 1, purpose: 1 });

// Static method to generate OTP
otpSchema.statics.generateOTP = function() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Static method to generate secure OTP
otpSchema.statics.generateSecureOTP = function() {
  const crypto = require('crypto');
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += digits[crypto.randomInt(0, digits.length)];
  }
  return otp;
};

// Instance method to verify OTP
otpSchema.methods.verifyOTP = async function(inputOTP) {
  if (this.verified) {
    throw new Error('OTP already verified');
  }
  
  if (this.expiresAt < new Date()) {
    throw new Error('OTP has expired');
  }
  
  if (this.attempts >= (parseInt(process.env.MAX_OTP_ATTEMPTS) || 3)) {
    throw new Error('Maximum OTP attempts exceeded');
  }

  this.attempts += 1;
  await this.save();

  if (this.otp !== inputOTP) {
    throw new Error('Invalid OTP');
  }

  this.verified = true;
  await this.save();
  
  return true;
};

module.exports = mongoose.model('OTP', otpSchema);
