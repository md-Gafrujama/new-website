const mongoose = require('mongoose');

const lmsRequestSchema = new mongoose.Schema({
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
  organizationName: {
    type: String,
    required: [true, 'Organization/Institution name is required'],
    trim: true,
    maxlength: [150, 'Organization name cannot exceed 150 characters']
  },

  // LMS Type and User Base
  lmsType: {
    type: String,
    required: [true, 'LMS type is required'],
    enum: {
      values: [
        'Corporate Training',
        'Educational Institution',
        'Online Course Platform',
        'Certification System',
        'Employee Training',
        'Customer Training',
        'Compliance Training',
        'Skills Development',
        'Professional Development',
        'Healthcare Training',
        'Government Training',
        'Non-profit Training',
        'Other'
      ],
      message: 'Invalid LMS type'
    }
  },
  numberOfUsers: {
    type: String,
    required: [true, 'Number of users is required'],
    enum: {
      values: [
        '1-50',
        '51-100',
        '101-500',
        '501-1000',
        '1001-5000',
        '5000+',
        'Not Sure'
      ],
      message: 'Invalid number of users range'
    }
  },

  // Core Features
  requiredFeatures: {
    type: [String],
    required: [true, 'At least one feature is required'],
    enum: {
      values: [
        'Course Creation & Management',
        'Content Library',
        'Video Streaming',
        'Interactive Content',
        'Quizzes & Assessments',
        'Assignments',
        'Certificates & Badges',
        'Progress Tracking',
        'Discussion Forums',
        'Live Classes/Webinars',
        'Mobile App',
        'Offline Learning',
        'Gamification',
        'Reporting & Analytics',
        'Multi-language Support',
        'E-commerce Integration',
        'SCORM Compliance',
        'Tin Can API (xAPI)',
        'User Management',
        'Role-based Access',
        'Social Learning',
        'Microlearning',
        'Blended Learning',
        'Personalized Learning Paths',
        'AI-powered Recommendations',
        'Proctoring & Security',
        'Virtual Classroom',
        'Content Authoring Tools',
        'API Access',
        'White Labeling',
        'Other'
      ],
      message: 'Invalid feature selected'
    },
    validate: {
      validator: function(arr) {
        return arr && arr.length > 0;
      },
      message: 'At least one feature must be selected'
    }
  },

  // Integration Requirements
  integrationNeeds: {
    type: [String],
    enum: {
      values: [
        'Payment Gateways',
        'Zoom/Teams Integration',
        'Google Workspace',
        'Microsoft 365',
        'Salesforce CRM',
        'HubSpot',
        'Slack Integration',
        'Email Services',
        'CRM Systems',
        'HR Systems (HRIS)',
        'SSO (Single Sign-On)',
        'Active Directory',
        'LDAP Integration',
        'Learning Analytics Tools',
        'Content Management Systems',
        'Video Conferencing Tools',
        'Third-party Content Providers',
        'Assessment Tools',
        'Certification Bodies',
        'Library Systems',
        'Student Information Systems',
        'E-portfolio Tools',
        'Document Management',
        'Marketing Automation',
        'Survey Tools',
        'Social Media Platforms',
        'Mobile Apps',
        'Custom APIs',
        'None',
        'Other'
      ],
      message: 'Invalid integration requirement'
    }
  },

  // Customization and Branding
  customizationRequirements: {
    type: String,
    trim: true,
    maxlength: [1000, 'Customization requirements cannot exceed 1000 characters'],
    default: ''
  },
  brandingNeeds: {
    type: [String],
    enum: {
      values: [
        'Custom Branding/Logo',
        'Custom Color Scheme',
        'Custom Domain',
        'White Label Solution',
        'Custom User Interface',
        'Custom Email Templates',
        'Custom Certificates',
        'Multi-tenant Architecture',
        'Department-specific Branding',
        'None'
      ],
      message: 'Invalid branding need'
    }
  },

  // Content and Learning Models
  contentTypes: {
    type: [String],
    enum: {
      values: [
        'Video Content',
        'Interactive Presentations',
        'Documents (PDF, Word)',
        'Audio Files',
        'SCORM Packages',
        'HTML5 Content',
        'Live Streaming',
        'Recorded Webinars',
        'Virtual Reality (VR)',
        'Augmented Reality (AR)',
        'Simulations',
        'Games & Scenarios',
        'Podcasts',
        'eBooks',
        'Infographics',
        'Other'
      ],
      message: 'Invalid content type'
    }
  },
  learningModels: {
    type: [String],
    enum: {
      values: [
        'Self-paced Learning',
        'Instructor-led Training',
        'Blended Learning',
        'Microlearning',
        'Social Learning',
        'Collaborative Learning',
        'Adaptive Learning',
        'Competency-based Learning',
        'Mobile Learning',
        'Just-in-time Learning',
        'Scenario-based Learning',
        'Problem-based Learning'
      ],
      message: 'Invalid learning model'
    }
  },

  // Technical Requirements
  deploymentPreference: {
    type: String,
    enum: {
      values: ['Cloud-based (SaaS)', 'On-premise', 'Hybrid', 'Mobile-first', 'No Preference'],
      message: 'Invalid deployment preference'
    },
    default: 'Cloud-based (SaaS)'
  },
  securityRequirements: {
    type: [String],
    enum: {
      values: [
        'Data Encryption',
        'SSL Certificates',
        'Two-Factor Authentication',
        'Role-based Security',
        'Audit Trails',
        'GDPR Compliance',
        'FERPA Compliance',
        'HIPAA Compliance',
        'SOC 2 Compliance',
        'ISO 27001',
        'Regular Backups',
        'Disaster Recovery',
        'Anti-plagiarism Tools',
        'Secure Proctoring',
        'IP Restrictions',
        'None Specified'
      ],
      message: 'Invalid security requirement'
    }
  },
  scalabilityNeeds: {
    type: Boolean,
    default: true
  },

  // Budget and Timeline
  budgetRange: {
    type: String,
    required: [true, 'Budget range is required'],
    enum: {
      values: [
        '$2,000 - $5,000',
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
  timeline: {
    type: String,
    required: [true, 'Timeline is required'],
    enum: {
      values: [
        '1-2 months',
        '2-4 months',
        '4-6 months',
        '6-12 months',
        '12+ months',
        'ASAP',
        'Flexible'
      ],
      message: 'Invalid timeline'
    }
  },

  // Support and Maintenance
  supportRequirements: {
    type: [String],
    enum: {
      values: [
        '24/7 Technical Support',
        'Business Hours Support',
        'Email Support',
        'Phone Support',
        'Live Chat Support',
        'Training & Onboarding',
        'Documentation',
        'Video Tutorials',
        'Community Forum',
        'Dedicated Account Manager',
        'Implementation Support',
        'Migration Assistance',
        'Custom Development',
        'Regular Updates',
        'Performance Monitoring'
      ],
      message: 'Invalid support requirement'
    }
  },

  // Analytics and Reporting
  reportingNeeds: {
    type: [String],
    enum: {
      values: [
        'Learner Progress Reports',
        'Course Completion Reports',
        'Assessment Results',
        'Engagement Analytics',
        'Time Tracking',
        'Custom Reports',
        'Real-time Dashboards',
        'Export Capabilities',
        'Automated Reports',
        'Compliance Reports',
        'ROI Analysis',
        'Skills Gap Analysis',
        'Learning Path Analytics',
        'Mobile Analytics',
        'Integration with BI Tools'
      ],
      message: 'Invalid reporting need'
    }
  },

  // Business Information
  industryVertical: {
    type: String,
    enum: [
      'Technology',
      'Healthcare',
      'Finance & Banking',
      'Manufacturing',
      'Education',
      'Government',
      'Retail',
      'Hospitality',
      'Non-profit',
      'Consulting',
      'Real Estate',
      'Legal',
      'Automotive',
      'Energy',
      'Telecommunications',
      'Media & Entertainment',
      'Agriculture',
      'Construction',
      'Transportation',
      'Other'
    ]
  },
  complianceRequirements: {
    type: [String],
    enum: {
      values: [
        'Corporate Training Compliance',
        'Educational Standards',
        'Professional Certification',
        'Industry Regulations',
        'Safety Training',
        'Quality Assurance',
        'Continuing Education',
        'Mandatory Training Tracking',
        'Audit Requirements',
        'None'
      ],
      message: 'Invalid compliance requirement'
    }
  },

  // Contact and Priority
  contactRole: {
    type: String,
    enum: [
      'CEO/Founder',
      'CTO/Technical Lead',
      'Training Manager',
      'HR Director',
      'Education Administrator',
      'Learning & Development Manager',
      'IT Manager',
      'Project Manager',
      'Other'
    ]
  },
  urgencyLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  additionalNotes: {
    type: String,
    trim: true,
    maxlength: [2000, 'Additional notes cannot exceed 2000 characters'],
    default: ''
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
lmsRequestSchema.index({ email: 1 });
lmsRequestSchema.index({ submittedAt: -1 });
lmsRequestSchema.index({ status: 1 });
lmsRequestSchema.index({ lmsType: 1 });
lmsRequestSchema.index({ numberOfUsers: 1 });
lmsRequestSchema.index({ budgetRange: 1 });
lmsRequestSchema.index({ urgencyLevel: 1 });

// Pre-save middleware
lmsRequestSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Instance methods
lmsRequestSchema.methods.getEstimatedBudget = function() {
  const budgetRanges = {
    '$2,000 - $5,000': 3500,
    '$5,000 - $15,000': 10000,
    '$15,000 - $30,000': 22500,
    '$30,000 - $60,000': 45000,
    '$60,000 - $100,000': 80000,
    '$100,000 - $200,000': 150000,
    '$200,000+': 200000
  };
  return budgetRanges[this.budgetRange] || 0;
};

lmsRequestSchema.methods.isComplexProject = function() {
  return this.requiredFeatures.length > 10 ||
         this.integrationNeeds.length > 5 ||
         this.customizationRequirements.length > 100 ||
         ['Educational Institution', 'Compliance Training'].includes(this.lmsType);
};

lmsRequestSchema.methods.isEnterpriseProject = function() {
  const enterpriseUsers = ['1001-5000', '5000+'];
  const enterpriseBudgets = ['$100,000 - $200,000', '$200,000+'];
  return enterpriseUsers.includes(this.numberOfUsers) || 
         enterpriseBudgets.includes(this.budgetRange);
};

// Static methods
lmsRequestSchema.statics.getDashboardStats = async function() {
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

module.exports = mongoose.model('LmsRequest', lmsRequestSchema);
