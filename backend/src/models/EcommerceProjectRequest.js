const mongoose = require('mongoose');

const ecommerceProjectRequestSchema = new mongoose.Schema({
  // Basic Information (1-4)
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
  companyName: {
    type: String,
    required: [true, 'Company/Brand name is required'],
    trim: true,
    maxlength: [150, 'Company name cannot exceed 150 characters']
  },

  // Project Details (5-7)
  projectType: {
    type: String,
    required: [true, 'Project type is required'],
    enum: {
      values: ['New Build', 'Redesign', 'Add Features'],
      message: 'Project type must be New Build, Redesign, or Add Features'
    }
  },
  platformsRequired: {
    type: [String],
    required: [true, 'At least one platform is required'],
    enum: {
      values: ['Website', 'iOS App', 'Android App', 'All'],
      message: 'Invalid platform selected'
    },
    validate: {
      validator: function(arr) {
        return arr && arr.length > 0;
      },
      message: 'At least one platform must be selected'
    }
  },
  targetAudience: {
    type: String,
    required: [true, 'Target audience is required'],
    trim: true,
    maxlength: [500, 'Target audience cannot exceed 500 characters']
  },

  // Product & Traffic Information (8-9)
  numberOfProducts: {
    type: String,
    required: [true, 'Number of products is required'],
    enum: {
      values: ['1-50', '51-200', '201-1000', '1000-5000', '5000+', 'Not Sure'],
      message: 'Invalid number of products range'
    }
  },
  expectedMonthlyUsers: {
    type: String,
    required: [true, 'Expected monthly users is required'],
    enum: {
      values: ['1K-10K', '10K-50K', '50K-100K', '100K-500K', '500K+', 'Not Sure'],
      message: 'Invalid expected monthly users range'
    }
  },

  // Core Features (10-13)
  requiredCoreFeatures: {
    type: [String],
    required: [true, 'At least one core feature is required'],
    enum: {
      values: [
        'Product Catalog',
        'Shopping Cart',
        'Checkout System',
        'Wishlist',
        'Product Search',
        'Product Filters',
        'Product Reviews',
        'User Profiles',
        'Order Tracking',
        'Customer Support',
        'Multi-vendor Support',
        'Subscription Management',
        'Digital Downloads',
        'Gift Cards',
        'Referral System',
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
  productVariations: {
    type: Boolean,
    default: false
  },
  productBundles: {
    type: Boolean,
    default: false
  },
  userAccountOptions: {
    type: [String],
    required: [true, 'User account options are required'],
    enum: {
      values: ['Guest Checkout', 'Social Login', 'Mandatory Signup', 'Optional Registration'],
      message: 'Invalid user account option'
    }
  },

  // Payment & Shipping (14-16)
  paymentMethods: {
    type: [String],
    required: [true, 'At least one payment method is required'],
    enum: {
      values: [
        'UPI',
        'Credit Cards',
        'Debit Cards',
        'Net Banking',
        'Digital Wallets',
        'Cash on Delivery',
        'Bank Transfer',
        'Cryptocurrency',
        'Buy Now Pay Later',
        'Subscriptions',
        'EMI Options',
        'Other'
      ],
      message: 'Invalid payment method selected'
    }
  },
  shippingMethod: {
    type: String,
    required: [true, 'Shipping method is required'],
    enum: {
      values: [
        'Standard Shipping',
        'Express Shipping',
        'Same Day Delivery',
        'Store Pickup',
        'Drop Shipping',
        'Third-party Logistics',
        'Custom Logistics',
        'Digital Only'
      ],
      message: 'Invalid shipping method'
    }
  },
  taxHandling: {
    type: String,
    required: [true, 'Tax handling is required'],
    enum: {
      values: ['Automatic GST', 'Manual Entry', 'No Tax', 'International Tax'],
      message: 'Invalid tax handling option'
    }
  },

  // Management Features (17-19)
  inventoryManagement: {
    type: Boolean,
    default: true
  },
  adminPanelModules: {
    type: [String],
    required: [true, 'At least one admin panel module is required'],
    enum: {
      values: [
        'Order Management',
        'Product Management',
        'User Management',
        'Inventory Control',
        'Sales Reports',
        'Analytics Dashboard',
        'Customer Support',
        'Marketing Tools',
        'Shipping Management',
        'Payment Management',
        'Content Management',
        'SEO Tools',
        'Discount Management',
        'Vendor Management',
        'Other'
      ],
      message: 'Invalid admin panel module'
    }
  },
  marketingTools: {
    type: [String],
    enum: {
      values: [
        'Discount Coupons',
        'Email Campaigns',
        'Push Notifications',
        'Loyalty Program',
        'Referral System',
        'Abandoned Cart Recovery',
        'Product Recommendations',
        'Flash Sales',
        'Seasonal Campaigns',
        'Social Media Integration',
        'Affiliate Marketing',
        'Influencer Tools',
        'Other'
      ],
      message: 'Invalid marketing tool selected'
    }
  },

  // Search & Personalization (20-21)
  searchPersonalizationLevel: {
    type: String,
    required: [true, 'Search & personalization level is required'],
    enum: {
      values: ['Basic Search', 'Advanced Filters', 'AI Recommendations', 'Machine Learning'],
      message: 'Invalid search & personalization level'
    }
  },
  reviewsRatingsSystem: {
    type: Boolean,
    default: true
  },

  // Internationalization (22)
  multiLanguageSupport: {
    type: Boolean,
    default: false
  },
  multiCurrencySupport: {
    type: Boolean,
    default: false
  },
  supportedLanguages: {
    type: [String],
    enum: {
      values: [
        'English', 'Hindi', 'Spanish', 'French', 'German', 'Italian', 
        'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Russian', 'Other'
      ]
    }
  },
  supportedCurrencies: {
    type: [String],
    enum: {
      values: ['USD', 'EUR', 'INR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY', 'Other']
    }
  },

  // Integrations (23)
  thirdPartyIntegrations: {
    type: [String],
    enum: {
      values: [
        'CRM Integration',
        'ERP Integration',
        'Payment Gateway',
        'Google Analytics',
        'Facebook Pixel',
        'Email Marketing Tools',
        'SMS Services',
        'Shipping Partners',
        'Accounting Software',
        'Inventory Management',
        'Customer Support Tools',
        'Social Media Platforms',
        'Review Platforms',
        'Tax Calculation',
        'Fraud Detection',
        'Other'
      ],
      message: 'Invalid third-party integration'
    }
  },

  // Live Features (24)
  liveFeatures: {
    type: [String],
    enum: {
      values: [
        'Live Chat',
        'Live Shopping',
        'Video Support',
        'Virtual Try-on',
        'Live Product Demos',
        'Real-time Inventory',
        'Live Customer Support',
        'Video Consultation',
        'Other'
      ],
      message: 'Invalid live feature'
    }
  },

  // Analytics & Tracking (25-27)
  analyticsTools: {
    type: [String],
    required: [true, 'Analytics tools are required'],
    enum: {
      values: [
        'Google Analytics',
        'Firebase Analytics',
        'Custom Analytics',
        'Heat Map Tools',
        'A/B Testing',
        'Conversion Tracking',
        'User Behavior Analytics',
        'Sales Analytics',
        'Other'
      ],
      message: 'Invalid analytics tool'
    }
  },
  pushNotifications: {
    type: Boolean,
    default: true
  },
  messagingFeatures: {
    type: [String],
    enum: {
      values: [
        'Email Notifications',
        'SMS Notifications',
        'Push Notifications',
        'In-app Messaging',
        'WhatsApp Integration',
        'Other'
      ]
    }
  },
  offlineMode: {
    type: Boolean,
    default: false
  },
  localCaching: {
    type: Boolean,
    default: false
  },

  // App Store & Security (28-29)
  appStorePublishing: {
    type: Boolean,
    default: false
  },
  securityComplianceNeeds: {
    type: [String],
    enum: {
      values: [
        'PCI DSS Compliance',
        'GDPR Compliance',
        'HIPAA Compliance',
        'SOC 2 Compliance',
        'Data Encryption',
        'SSL Certificates',
        'Two-Factor Authentication',
        'Fraud Detection',
        'Regular Security Audits',
        'Other'
      ],
      message: 'Invalid security compliance need'
    }
  },

  // Design & Customization (30-31)
  designPreferences: {
    type: String,
    trim: true,
    maxlength: [500, 'Design preferences cannot exceed 500 characters']
  },
  brandingElements: {
    type: String,
    trim: true,
    maxlength: [300, 'Branding elements cannot exceed 300 characters']
  },
  customizationLevel: {
    type: String,
    required: [true, 'Customization level is required'],
    enum: {
      values: ['Template Based', 'Semi-custom', 'Fully Custom'],
      message: 'Invalid customization level'
    }
  },

  // Infrastructure & Support (32-33)
  hostingPreference: {
    type: String,
    required: [true, 'Hosting preference is required'],
    enum: {
      values: ['Cloud Hosting', 'On-premise', 'Managed Hosting', 'Shared Hosting'],
      message: 'Invalid hosting preference'
    }
  },
  maintenanceSupport: {
    type: String,
    required: [true, 'Maintenance & support preference is required'],
    enum: {
      values: ['Monthly Support', '24x7 Support', 'On-demand Support', 'Self-managed'],
      message: 'Invalid maintenance & support option'
    }
  },

  // Budget & Timeline (34-35)
  budgetRange: {
    type: String,
    required: [true, 'Budget range is required'],
    enum: {
      values: [
        '$5,000 - $15,000',
        '$15,000 - $30,000',
        '$30,000 - $60,000',
        '$60,000 - $100,000',
        '$100,000 - $200,000',
        '$200,000+'
      ],
      message: 'Invalid budget range'
    }
  },
  desiredTimeline: {
    type: String,
    required: [true, 'Desired timeline is required'],
    enum: {
      values: [
        '1-3 months',
        '3-6 months',
        '6-12 months',
        '12+ months',
        'ASAP',
        'Flexible'
      ],
      message: 'Invalid timeline'
    }
  },

  // Contact & Additional (36)
  pointOfContact: {
    type: String,
    trim: true,
    maxlength: [100, 'Point of contact cannot exceed 100 characters']
  },
  contactRole: {
    type: String,
    enum: [
      'Business Owner',
      'Project Manager',
      'CTO/Technical Lead',
      'Marketing Manager',
      'Product Manager',
      'Other'
    ]
  },
  additionalNotes: {
    type: String,
    trim: true,
    maxlength: [2000, 'Additional notes cannot exceed 2000 characters'],
    default: ''
  },

  // System fields
  attachments: [{
    filename: String,
    url: String,
    fileType: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
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
ecommerceProjectRequestSchema.index({ email: 1 });
ecommerceProjectRequestSchema.index({ submittedAt: -1 });
ecommerceProjectRequestSchema.index({ status: 1 });
ecommerceProjectRequestSchema.index({ projectType: 1 });
ecommerceProjectRequestSchema.index({ budgetRange: 1 });
ecommerceProjectRequestSchema.index({ priority: 1 });
ecommerceProjectRequestSchema.index({ companyName: 1 });

// Pre-save middleware
ecommerceProjectRequestSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Instance methods
ecommerceProjectRequestSchema.methods.getEstimatedBudget = function() {
  const budgetRanges = {
    '$5,000 - $15,000': 10000,
    '$15,000 - $30,000': 22500,
    '$30,000 - $60,000': 45000,
    '$60,000 - $100,000': 80000,
    '$100,000 - $200,000': 150000,
    '$200,000+': 200000
  };
  return budgetRanges[this.budgetRange] || 0;
};

ecommerceProjectRequestSchema.methods.isComplexProject = function() {
  return this.platformsRequired.length > 2 ||
         this.requiredCoreFeatures.length > 8 ||
         this.thirdPartyIntegrations.length > 5 ||
         this.customizationLevel === 'Fully Custom';
};

ecommerceProjectRequestSchema.methods.isHighValueProject = function() {
  const highValueBudgets = ['$100,000 - $200,000', '$200,000+'];
  return highValueBudgets.includes(this.budgetRange);
};

// Static methods
ecommerceProjectRequestSchema.statics.getDashboardStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const result = {
    pending: 0,
    reviewed: 0,
    'in-progress': 0,
    completed: 0,
    total: 0
  };
  
  stats.forEach(stat => {
    result[stat._id] = stat.count;
    result.total += stat.count;
  });
  
  return result;
};

module.exports = mongoose.model('EcommerceProjectRequest', ecommerceProjectRequestSchema);
