const mongoose = require('mongoose');

const mobileAppRequestSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Full name must be at least 2 characters long'],
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    maxlength: [255, 'Email cannot exceed 255 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    minlength: [10, 'Phone number must be at least 10 characters long'],
    maxlength: [20, 'Phone number cannot exceed 20 characters']
  },
  appType: {
    type: [String],
    required: [true, 'At least one app type is required'],
    enum: {
      values: ['iOS', 'Android', 'Both'],
      message: 'App type must be iOS, Android, or Both'
    },
    validate: {
      validator: function(arr) {
        return arr && arr.length > 0;
      },
      message: 'At least one app type must be selected'
    }
  },
  preferredFramework: {
    type: String,
    required: [true, 'Preferred framework is required'],
    enum: {
      values: ['React Native', 'Flutter', 'Native iOS (Swift)', 'Native Android (Kotlin)', 'Xamarin', 'Ionic', 'Cordova', 'No Preference'],
      message: 'Invalid preferred framework'
    }
  },
  mainFeatures: {
    type: [String],
    required: [true, 'At least one main feature is required'],
    enum: {
      values: [
        'User Registration/Login',
        'Push Notifications', 
        'In-App Purchases',
        'Social Media Integration',
        'GPS/Location Services',
        'Camera/Photo Gallery',
        'Chat/Messaging',
        'Payment Gateway',
        'Offline Support',
        'Cloud Storage',
        'Analytics Integration',
        'Admin Panel',
        'Multi-language Support',
        'Dark Mode',
        'Biometric Authentication',
        'AR/VR Features',
        'Video Streaming',
        'File Sharing',
        'Calendar Integration',
        'Maps Integration',
        'Other'
      ],
      message: 'Invalid main feature selected'
    },
    validate: {
      validator: function(arr) {
        return arr && arr.length > 0;
      },
      message: 'At least one main feature must be selected'
    }
  },
  targetAudience: {
    type: String,
    required: [true, 'Target audience is required'],
    trim: true,
    minlength: [10, 'Target audience description must be at least 10 characters'],
    maxlength: [500, 'Target audience description cannot exceed 500 characters']
  },
  backendRequired: {
    type: Boolean,
    required: [true, 'Backend requirement must be specified'],
    default: true
  },
  budgetRange: {
    type: String,
    required: [true, 'Budget range is required'],
    enum: {
      values: ['$2,000 - $5,000', '$5,000 - $10,000', '$10,000 - $25,000', '$25,000 - $50,000', '$50,000 - $100,000', '$100,000+'],
      message: 'Invalid budget range'
    }
  },
  timeline: {
    type: String,
    required: [true, 'Timeline is required'],
    enum: {
      values: ['1-2 months', '2-4 months', '4-6 months', '6-12 months', '12+ months'],
      message: 'Invalid timeline'
    }
  },
  appDesignPreference: {
    type: String,
    required: [true, 'App design preference is required'],
    enum: {
      values: ['Modern/Material Design', 'Minimal/Clean', 'Corporate/Professional', 'Creative/Artistic', 'Gaming/Playful', 'Dark Theme', 'Custom Brand Style'],
      message: 'Invalid app design preference'
    }
  },
  additionalNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Additional notes cannot exceed 1000 characters'],
    default: ''
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'reviewed', 'in-progress', 'completed'],
      message: 'Status must be one of: pending, reviewed, in-progress, completed'
    },
    default: 'pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better performance
mobileAppRequestSchema.index({ email: 1 });
mobileAppRequestSchema.index({ submittedAt: -1 });
mobileAppRequestSchema.index({ status: 1 });
mobileAppRequestSchema.index({ appType: 1 });
mobileAppRequestSchema.index({ preferredFramework: 1 });
mobileAppRequestSchema.index({ budgetRange: 1 });

// Pre-save middleware
mobileAppRequestSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('MobileAppRequest', mobileAppRequestSchema);
