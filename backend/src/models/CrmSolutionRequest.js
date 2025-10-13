const mongoose = require('mongoose');

const crmSolutionRequestSchema = new mongoose.Schema({
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
    required: [true, 'Business name is required'],
    trim: true,
    minlength: [2, 'Business name must be at least 2 characters long'],
    maxlength: [150, 'Business name cannot exceed 150 characters']
  },
  teamSize: {
    type: String,
    required: [true, 'Team size is required'],
    enum: {
      values: ['1-5', '6-15', '16-30', '31-50', '51-100', '101-250', '251-500', '500+'],
      message: 'Invalid team size'
    }
  },
  currentCrmTool: {
    type: String,
    trim: true,
    maxlength: [100, 'Current CRM tool cannot exceed 100 characters'],
    default: 'None'
  },
  requiredModules: {
    type: [String],
    required: [true, 'At least one module is required'],
    enum: {
      values: [
        'Lead Management',
        'Deal Pipeline',
        'Contact Management',
        'Task Management',
        'Email Marketing',
        'Sales Automation',
        'Reporting & Analytics',
        'Customer Support',
        'Invoice Management',
        'Document Management',
        'Calendar Integration',
        'Mobile App',
        'Team Collaboration',
        'Quote Management',
        'Inventory Management',
        'Project Management',
        'Social Media Integration',
        'Call Management',
        'Live Chat',
        'Knowledge Base',
        'Other'
      ],
      message: 'Invalid required module selected'
    },
    validate: {
      validator: function(arr) {
        return arr && arr.length > 0;
      },
      message: 'At least one required module must be selected'
    }
  },
  integrationRequirements: {
    type: [String],
    enum: {
      values: [
        'Email Services (Gmail, Outlook)',
        'WhatsApp Integration',
        'SMS Services',
        'Payment Gateways',
        'Social Media Platforms',
        'Accounting Software (QuickBooks, Xero)',
        'E-commerce Platforms',
        'Phone Systems (VoIP)',
        'Marketing Tools (Mailchimp, HubSpot)',
        'Third-party APIs',
        'Google Workspace',
        'Microsoft 365',
        'Slack Integration',
        'Zoom Integration',
        'Zapier Integration',
        'Custom Integrations',
        'None',
        'Other'
      ],
      message: 'Invalid integration requirement selected'
    }
  },
  customizationNeeds: {
    type: String,
    trim: true,
    maxlength: [500, 'Customization needs cannot exceed 500 characters'],
    default: ''
  },
  budgetRange: {
    type: String,
    required: [true, 'Budget range is required'],
    enum: {
      values: [
        '$1,000 - $3,000',
        '$3,000 - $7,000',
        '$7,000 - $15,000',
        '$15,000 - $30,000',
        '$30,000 - $50,000',
        '$50,000 - $100,000',
        '$100,000+'
      ],
      message: 'Invalid budget range'
    }
  },
  timeline: {
    type: String,
    required: [true, 'Timeline is required'],
    enum: {
      values: [
        '2-4 weeks',
        '1-2 months',
        '2-4 months',
        '4-6 months',
        '6-12 months',
        '12+ months',
        'Flexible'
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
  currentChallenges: {
    type: [String],
    enum: [
      'Lead Management',
      'Sales Tracking',
      'Customer Retention',
      'Data Organization',
      'Team Collaboration',
      'Reporting',
      'Integration Issues',
      'Manual Processes',
      'Follow-up Management',
      'Customer Communication',
      'Other'
    ]
  },
  expectedUsers: {
    type: String,
    enum: [
      '1-10 users',
      '11-25 users',
      '26-50 users',
      '51-100 users',
      '100+ users'
    ]
  },
  deploymentPreference: {
    type: String,
    enum: ['Cloud-based', 'On-premise', 'Hybrid', 'No Preference'],
    default: 'Cloud-based'
  },
  dataSecurityRequirements: {
    type: [String],
    enum: [
      'GDPR Compliance',
      'HIPAA Compliance',
      'SOX Compliance',
      'Data Encryption',
      'Regular Backups',
      'Access Control',
      'Audit Trails',
      'Two-Factor Authentication',
      'Single Sign-On (SSO)',
      'None',
      'Other'
    ]
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
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
crmSolutionRequestSchema.index({ email: 1 });
crmSolutionRequestSchema.index({ submittedAt: -1 });
crmSolutionRequestSchema.index({ status: 1 });
crmSolutionRequestSchema.index({ teamSize: 1 });
crmSolutionRequestSchema.index({ budgetRange: 1 });
crmSolutionRequestSchema.index({ priority: 1 });

// Compound indexes
crmSolutionRequestSchema.index({ status: 1, submittedAt: -1 });
crmSolutionRequestSchema.index({ teamSize: 1, status: 1 });
crmSolutionRequestSchema.index({ priority: 1, status: 1 });

// Pre-save middleware
crmSolutionRequestSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Instance methods
crmSolutionRequestSchema.methods.getEstimatedCost = function() {
  const baseCosts = {
    '$1,000 - $3,000': 2000,
    '$3,000 - $7,000': 5000,
    '$7,000 - $15,000': 11000,
    '$15,000 - $30,000': 22500,
    '$30,000 - $50,000': 40000,
    '$50,000 - $100,000': 75000,
    '$100,000+': 100000
  };
  return baseCosts[this.budgetRange] || 0;
};

crmSolutionRequestSchema.methods.isComplexProject = function() {
  const complexModules = [
    'Sales Automation',
    'Reporting & Analytics',
    'Inventory Management',
    'Project Management'
  ];
  return this.requiredModules.some(module => complexModules.includes(module)) ||
         this.integrationRequirements.length > 3;
};

crmSolutionRequestSchema.methods.isLargeTeam = function() {
  const largeTeamSizes = ['101-250', '251-500', '500+'];
  return largeTeamSizes.includes(this.teamSize);
};

crmSolutionRequestSchema.methods.requiresCompliance = function() {
  const complianceRequirements = ['GDPR Compliance', 'HIPAA Compliance', 'SOX Compliance'];
  return this.dataSecurityRequirements && 
         this.dataSecurityRequirements.some(req => complianceRequirements.includes(req));
};

// Static methods
crmSolutionRequestSchema.statics.getDashboardStats = async function() {
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

crmSolutionRequestSchema.statics.getTeamSizeStats = async function() {
  return this.aggregate([
    {
      $group: {
        _id: '$teamSize',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
};

crmSolutionRequestSchema.statics.getBudgetStats = async function() {
  return this.aggregate([
    {
      $group: {
        _id: '$budgetRange',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
};

crmSolutionRequestSchema.statics.getPriorityStats = async function() {
  return this.aggregate([
    {
      $group: {
        _id: '$priority',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
};

module.exports = mongoose.model('CrmSolutionRequest', crmSolutionRequestSchema);
