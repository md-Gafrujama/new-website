const mongoose = require('mongoose');

const digitalMarketingRequestSchema = new mongoose.Schema({
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
  businessWebsite: {
    type: String,
    trim: true,
    maxlength: [200, 'Business website URL cannot exceed 200 characters'],
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow empty
        return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
      },
      message: 'Please enter a valid website URL'
    }
  },
  socialLink: {
    type: String,
    trim: true,
    maxlength: [200, 'Social link cannot exceed 200 characters'],
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow empty
        return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
      },
      message: 'Please enter a valid social media URL'
    }
  },
  marketingType: {
    type: [String],
    required: [true, 'At least one marketing type is required'],
    enum: {
      values: [
        'SEO (Search Engine Optimization)',
        'Google Ads (PPC)',
        'Facebook Ads',
        'Instagram Marketing',
        'YouTube Marketing',
        'LinkedIn Marketing',
        'TikTok Marketing',
        'Twitter Marketing',
        'Content Marketing',
        'Email Marketing',
        'Social Media Management',
        'Influencer Marketing',
        'Affiliate Marketing',
        'Video Marketing',
        'Podcast Marketing',
        'PR & Media Outreach',
        'Local SEO',
        'E-commerce Marketing',
        'Other'
      ],
      message: 'Invalid marketing type selected'
    },
    validate: {
      validator: function(arr) {
        return arr && arr.length > 0;
      },
      message: 'At least one marketing type must be selected'
    }
  },
  targetAudience: {
    type: String,
    required: [true, 'Target audience is required'],
    trim: true,
    minlength: [10, 'Target audience description must be at least 10 characters'],
    maxlength: [500, 'Target audience description cannot exceed 500 characters']
  },
  targetRegion: {
    type: String,
    required: [true, 'Target region is required'],
    trim: true,
    maxlength: [100, 'Target region cannot exceed 100 characters']
  },
  monthlyBudget: {
    type: String,
    required: [true, 'Monthly budget is required'],
    enum: {
      values: [
        '$500 - $1,000',
        '$1,000 - $2,500',
        '$2,500 - $5,000',
        '$5,000 - $10,000',
        '$10,000 - $25,000',
        '$25,000 - $50,000',
        '$50,000+'
      ],
      message: 'Invalid monthly budget range'
    }
  },
  currentMarketingChallenges: {
    type: [String],
    enum: {
      values: [
        'Low Website Traffic',
        'Poor Conversion Rates',
        'High Cost Per Acquisition',
        'Low Brand Awareness',
        'Weak Social Media Presence',
        'Poor Search Engine Rankings',
        'Limited Lead Generation',
        'Inconsistent Messaging',
        'Lack of Analytics/Tracking',
        'Competition',
        'Budget Constraints',
        'Time Constraints',
        'Lack of Expertise',
        'Outdated Website',
        'Poor Customer Retention',
        'Other'
      ],
      message: 'Invalid marketing challenge selected'
    }
  },
  campaignGoals: {
    type: [String],
    required: [true, 'At least one campaign goal is required'],
    enum: {
      values: [
        'Generate Leads',
        'Increase Website Traffic',
        'Boost Sales/Revenue',
        'Build Brand Awareness',
        'Improve Online Presence',
        'Increase App Downloads',
        'Drive Event Registrations',
        'Grow Email Subscribers',
        'Enhance Customer Engagement',
        'Improve Search Rankings',
        'Increase Social Media Followers',
        'Promote New Product/Service',
        'Customer Retention',
        'Market Expansion',
        'Competitive Advantage',
        'Other'
      ],
      message: 'Invalid campaign goal selected'
    },
    validate: {
      validator: function(arr) {
        return arr && arr.length > 0;
      },
      message: 'At least one campaign goal must be selected'
    }
  },
  timeline: {
    type: String,
    required: [true, 'Timeline is required'],
    enum: {
      values: [
        '1-3 months',
        '3-6 months',
        '6-12 months',
        '12+ months',
        'Ongoing/Long-term',
        'ASAP/Urgent'
      ],
      message: 'Invalid timeline'
    }
  },
  additionalNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Additional notes cannot exceed 1000 characters'],
    default: ''
  },
  // Business specific fields
  businessType: {
    type: String,
    trim: true,
    maxlength: [100, 'Business type cannot exceed 100 characters']
  },
  industryVertical: {
    type: String,
    enum: [
      'Technology',
      'Healthcare',
      'Finance',
      'E-commerce',
      'Education',
      'Real Estate',
      'Manufacturing',
      'Retail',
      'Hospitality',
      'Legal',
      'Automotive',
      'Food & Beverage',
      'Fashion',
      'Beauty & Wellness',
      'Travel & Tourism',
      'Entertainment',
      'Non-profit',
      'B2B Services',
      'Consulting',
      'Other'
    ]
  },
  competitorAnalysis: {
    type: Boolean,
    default: false
  },
  hasExistingMarketingTeam: {
    type: Boolean,
    default: false
  },
  currentMarketingTools: {
    type: [String],
    enum: [
      'Google Analytics',
      'Google Ads',
      'Facebook Business Manager',
      'HubSpot',
      'Mailchimp',
      'Hootsuite',
      'Buffer',
      'SEMrush',
      'Ahrefs',
      'Moz',
      'Canva',
      'Adobe Creative Suite',
      'WordPress',
      'Shopify',
      'Salesforce',
      'None',
      'Other'
    ]
  },
  previousMarketingExperience: {
    type: String,
    enum: [
      'None',
      'Basic (DIY)',
      'Some Experience',
      'Experienced',
      'Very Experienced'
    ],
    default: 'Some Experience'
  },
  urgencyLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  expectedROI: {
    type: String,
    enum: [
      '2x Return',
      '3x Return',
      '4x Return',
      '5x+ Return',
      'Break Even',
      'Not Sure'
    ]
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
digitalMarketingRequestSchema.index({ email: 1 });
digitalMarketingRequestSchema.index({ submittedAt: -1 });
digitalMarketingRequestSchema.index({ status: 1 });
digitalMarketingRequestSchema.index({ marketingType: 1 });
digitalMarketingRequestSchema.index({ monthlyBudget: 1 });
digitalMarketingRequestSchema.index({ urgencyLevel: 1 });
digitalMarketingRequestSchema.index({ industryVertical: 1 });

// Compound indexes
digitalMarketingRequestSchema.index({ status: 1, submittedAt: -1 });
digitalMarketingRequestSchema.index({ urgencyLevel: 1, status: 1 });
digitalMarketingRequestSchema.index({ industryVertical: 1, status: 1 });

// Pre-save middleware
digitalMarketingRequestSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Instance methods
digitalMarketingRequestSchema.methods.getEstimatedBudget = function() {
  const budgetRanges = {
    '$500 - $1,000': 750,
    '$1,000 - $2,500': 1750,
    '$2,500 - $5,000': 3750,
    '$5,000 - $10,000': 7500,
    '$10,000 - $25,000': 17500,
    '$25,000 - $50,000': 37500,
    '$50,000+': 50000
  };
  return budgetRanges[this.monthlyBudget] || 0;
};

digitalMarketingRequestSchema.methods.isHighValueClient = function() {
  const highValueBudgets = ['$10,000 - $25,000', '$25,000 - $50,000', '$50,000+'];
  return highValueBudgets.includes(this.monthlyBudget);
};

digitalMarketingRequestSchema.methods.isUrgentRequest = function() {
  return this.urgencyLevel === 'High' || this.urgencyLevel === 'Critical' || 
         this.timeline === 'ASAP/Urgent';
};

digitalMarketingRequestSchema.methods.isComplexCampaign = function() {
  return this.marketingType.length > 3 || 
         this.campaignGoals.length > 4 ||
         this.competitorAnalysis === true;
};

// Static methods
digitalMarketingRequestSchema.statics.getDashboardStats = async function() {
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

digitalMarketingRequestSchema.statics.getBudgetStats = async function() {
  return this.aggregate([
    {
      $group: {
        _id: '$monthlyBudget',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
};

digitalMarketingRequestSchema.statics.getMarketingTypeStats = async function() {
  return this.aggregate([
    { $unwind: '$marketingType' },
    {
      $group: {
        _id: '$marketingType',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
};

digitalMarketingRequestSchema.statics.getIndustryStats = async function() {
  return this.aggregate([
    {
      $match: { industryVertical: { $ne: null } }
    },
    {
      $group: {
        _id: '$industryVertical',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
};

module.exports = mongoose.model('DigitalMarketingRequest', digitalMarketingRequestSchema);
