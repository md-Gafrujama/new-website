const mongoose = require('mongoose');

const saasProductRequestSchema = new mongoose.Schema({
  // Basic Information
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
  businessName: {
    type: String,
    required: [true, 'Business/Startup name is required'],
    trim: true,
    maxlength: [150, 'Business name cannot exceed 150 characters']
  },

  // Product Concept
  productIdea: {
    type: String,
    required: [true, 'Product idea/concept is required'],
    trim: true,
    maxlength: [2000, 'Product idea cannot exceed 2000 characters']
  },
  targetAudience: {
    type: String,
    required: [true, 'Target audience is required'],
    trim: true,
    maxlength: [1000, 'Target audience cannot exceed 1000 characters']
  },

  // Technical Requirements
  coreFeatures: {
    type: [String],
    required: [true, 'At least one core feature is required'],
    enum: {
      values: [
        'User Authentication',
        'Dashboard & Analytics',
        'Data Management',
        'Third-party Integrations',
        'Reporting',
        'Subscription Management',
        'User Profiles',
        'Admin Panel',
        'Notifications',
        'Real-time Collaboration',
        'API Access',
        'Offline Support',
        'AI/ML Features',
        'Mobile App Support',
        'Other'
      ],
      message: 'Invalid core feature selected'
    },
    validate: {
      validator: function(arr) {
        return arr && arr.length > 0;
      },
      message: 'At least one core feature must be selected'
    }
  },
  monetizationModel: {
    type: [String],
    required: [true, 'At least one monetization model is required'],
    enum: {
      values: [
        'Subscription (Monthly/Annual)',
        'Freemium',
        'Pay-per-use',
        'One-time Purchase',
        'Tiered Pricing',
        'Marketplace Fees',
        'Advertising',
        'Hybrid Model',
        'Custom Pricing',
        'Not Decided'
      ],
      message: 'Invalid monetization model selected'
    }
  },
  preferredTechStack: {
    type: String,
    required: [true, 'Preferred tech stack is required'],
    enum: {
      values: [
        'MERN Stack (MongoDB, Express, React, Node.js)',
        'MEAN Stack (MongoDB, Express, Angular, Node.js)',
        'MEVN Stack (MongoDB, Express, Vue.js, Node.js)',
        'LAMP Stack (Linux, Apache, MySQL, PHP)',
        'Serverless (AWS Lambda, Google Cloud Functions)',
        'Python/Django',
        'Ruby on Rails',
        '.NET Core',
        'Java/Spring',
        'Custom Stack',
        'No Preference'
      ],
      message: 'Invalid tech stack selected'
    }
  },
  scalabilityRequirements: {
    type: [String],
    required: [true, 'Scalability requirements are required'],
    enum: {
      values: [
        'Cloud-based (AWS, GCP, Azure)',
        'Multi-user Support',
        'Multi-tenant Architecture',
        'Load Balancing',
        'Auto-scaling',
        'High Availability',
        'Global CDN',
        'Not Sure',
        'Other'
      ],
      message: 'Invalid scalability requirement selected'
    }
  },
  integrationNeeds: {
    type: [String],
    enum: {
      values: [
        'Payment Gateways (Stripe, PayPal)',
        'CRM Integration (Salesforce, HubSpot)',
        'Email Services (SendGrid, Mailgun)',
        'SMS Services (Twilio)',
        'Social Media APIs',
        'Cloud Storage (S3, Google Cloud Storage)',
        'Analytics Tools (Google Analytics, Mixpanel)',
        'Customer Support Tools (Zendesk, Intercom)',
        'Accounting Software (QuickBooks, Xero)',
        'Third-party APIs',
        'Single Sign-On (SSO)',
        'Marketing Automation',
        'Video Conferencing',
        'None',
        'Other'
      ],
      message: 'Invalid integration need selected'
    }
  },

  // Project Management
  budgetRange: {
    type: String,
    required: [true, 'Budget range is required'],
    enum: {
      values: [
        '$10,000 - $25,000 (MVP)',
        '$25,000 - $50,000',
        '$50,000 - $100,000',
        '$100,000 - $250,000',
        '$250,000+'
      ],
      message: 'Invalid budget range'
    }
  },
  projectTimeline: {
    type: String,
    required: [true, 'Project timeline is required'],
    enum: {
      values: [
        '1-3 months (MVP)',
        '3-6 months',
        '6-12 months',
        '12+ months',
        'Flexible'
      ],
      message: 'Invalid project timeline'
    }
  },

  // Additional Information
  additionalNotes: {
    type: String,
    trim: true,
    maxlength: [2000, 'Additional notes cannot exceed 2000 characters'],
    default: ''
  },
  competitors: {
    type: [String],
    default: []
  },
  uniqueSellingProposition: {
    type: String,
    trim: true,
    maxlength: [1000, 'Unique selling proposition cannot exceed 1000 characters']
  },
  hasExistingTeam: {
    type: Boolean,
    default: false
  },
  designPreferences: {
    type: String,
    trim: true,
    maxlength: [1000, 'Design preferences cannot exceed 1000 characters']
  },

  // System Fields
  status: {
    type: String,
    enum: {
      values: ['pending', 'reviewed', 'in-progress', 'completed'],
      message: 'Status must be one of: pending, reviewed, in-progress, completed'
    },
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
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

// Indexes
saasProductRequestSchema.index({ email: 1 });
saasProductRequestSchema.index({ submittedAt: -1 });
saasProductRequestSchema.index({ status: 1 });
saasProductRequestSchema.index({ preferredTechStack: 1 });
saasProductRequestSchema.index({ budgetRange: 1 });
saasProductRequestSchema.index({ priority: 1 });

// Pre-save middleware
saasProductRequestSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('SaaSProductRequest', saasProductRequestSchema);
