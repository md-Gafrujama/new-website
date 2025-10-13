const mongoose = require('mongoose');

const hrmsSolutionRequestSchema = new mongoose.Schema({
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
  companySize: {
    type: String,
    required: [true, 'Company size is required'],
    enum: {
      values: ['1-10', '11-25', '26-50', '51-100', '101-250', '251-500', '501-1000', '1000+'],
      message: 'Invalid company size'
    }
  },
  requiredModules: {
    type: [String],
    required: [true, 'At least one module is required'],
    enum: {
      values: [
        'Employee Management',
        'Payroll Management',
        'Attendance Tracking',
        'Leave Management',
        'Performance Management',
        'Recruitment',
        'Training & Development',
        'Document Management',
        'Employee Self-Service',
        'Reporting & Analytics',
        'Compliance Management',
        'Benefits Administration',
        'Time Tracking',
        'Expense Management',
        'Asset Management',
        'Exit Management',
        'Employee Engagement',
        'Succession Planning',
        'Goal Management',
        'Appraisal System',
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
  currentHrTools: {
    type: String,
    trim: true,
    maxlength: [200, 'Current HR tools cannot exceed 200 characters'],
    default: 'None'
  },
  integrationRequirements: {
    type: [String],
    enum: {
      values: [
        'Payroll Systems',
        'Accounting Software (QuickBooks, SAP)',
        'Time Tracking Tools',
        'Email Services',
        'Calendar Systems',
        'Document Management',
        'Biometric Systems',
        'Third-party APIs',
        'Banking Systems',
        'ERP Systems',
        'Learning Management Systems',
        'Background Check Services',
        'Video Conferencing Tools',
        'Single Sign-On (SSO)',
        'Active Directory',
        'None',
        'Other'
      ],
      message: 'Invalid integration requirement selected'
    }
  },
  accessControlLevels: {
    type: [String],
    required: [true, 'At least one access control level is required'],
    enum: {
      values: [
        'Super Admin',
        'HR Manager',
        'Department Manager',
        'Team Leader',
        'Employee',
        'Finance Team',
        'IT Team',
        'Payroll Administrator',
        'Recruitment Specialist',
        'Training Coordinator',
        'Compliance Officer',
        'Executive Leadership',
        'Other'
      ],
      message: 'Invalid access control level selected'
    },
    validate: {
      validator: function(arr) {
        return arr && arr.length > 0;
      },
      message: 'At least one access control level must be selected'
    }
  },
  customizationNeeded: {
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
        '$2,000 - $5,000',
        '$5,000 - $12,000',
        '$12,000 - $25,000',
        '$25,000 - $50,000',
        '$50,000 - $100,000',
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
        '12-18 months',
        '18+ months',
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
  complianceRequirements: {
    type: [String],
    enum: [
      'GDPR Compliance',
      'HIPAA Compliance',
      'SOX Compliance',
      'FLSA Compliance',
      'Equal Employment Opportunity',
      'OSHA Compliance',
      'Local Labor Laws',
      'International Standards',
      'None',
      'Other'
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
      'Data Encryption',
      'Regular Backups',
      'Access Control',
      'Audit Trails',
      'Two-Factor Authentication',
      'Single Sign-On (SSO)',
      'Role-based Permissions',
      'Data Anonymization',
      'Secure API Access',
      'None',
      'Other'
    ]
  },
  expectedUsers: {
    type: String,
    enum: [
      '1-25 users',
      '26-50 users',
      '51-100 users',
      '101-250 users',
      '251-500 users',
      '500+ users'
    ]
  },
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
hrmsSolutionRequestSchema.index({ email: 1 });
hrmsSolutionRequestSchema.index({ submittedAt: -1 });
hrmsSolutionRequestSchema.index({ status: 1 });
hrmsSolutionRequestSchema.index({ companySize: 1 });
hrmsSolutionRequestSchema.index({ budgetRange: 1 });
hrmsSolutionRequestSchema.index({ priority: 1 });

module.exports = mongoose.model('HrmsSolutionRequest', hrmsSolutionRequestSchema);
