const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  firstName: {
    type: String,
    trim: true,
    default: 'Admin'
  },
  lastName: {
    type: String,
    trim: true,
    default: 'User'
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
    default: 0
  },
  lockUntil: {
    type: Date
  },
  twoFactorEnabled: {
    type: Boolean,
    default: true
  },
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

// Virtual for account locking
adminSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Virtual for full name
adminSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`.trim();
});

// Pre-save middleware
adminSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Compare password method
adminSchema.methods.comparePassword = async function(candidatePassword) {
  if (this.isLocked) {
    throw new Error('Account is temporarily locked');
  }
  return bcrypt.compare(candidatePassword, this.password);
};

// Increment login attempts
adminSchema.methods.incLoginAttempts = async function() {
  const maxAttempts = 5;
  const lockTime = 30 * 60 * 1000; // 30 minutes

  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: {
        loginAttempts: 1,
        lockUntil: 1
      }
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };

  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
    updates.$set = {
      lockUntil: Date.now() + lockTime
    };
  }

  return this.updateOne(updates);
};

// Reset login attempts
adminSchema.methods.resetLoginAttempts = async function() {
  return this.updateOne({
    $unset: {
      loginAttempts: 1,
      lockUntil: 1
    },
    $set: {
      lastLogin: new Date()
    }
  });
};

// JSON transform
adminSchema.methods.toJSON = function() {
  const admin = this.toObject();
  delete admin.password;
  delete admin.loginAttempts;
  delete admin.lockUntil;
  return admin;
};

module.exports = mongoose.model('Admin', adminSchema);
