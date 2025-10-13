const mongoose = require('mongoose');

const cloudHostingRequestSchema = new mongoose.Schema({
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
  currentHostingProvider: {
    type: String,
    trim: true,
    maxlength: [100, 'Current hosting provider cannot exceed 100 characters'],
    default: 'None'
  },
  serviceType: {
    type: [String],
    required: [true, 'At least one service type is required'],
    enum: {
      values: [
        'Cloud Setup & Migration',
        'Website Hosting',
        'Server Management',
        'Database Management',
        'Backup Solutions',
        'Security Services',
        'Performance Optimization',
        'Technical Support',
        'DevOps Services',
        'CDN Setup',
        'Email Hosting',
        'SSL Certificate Setup',
        'Domain Management',
        'Monitoring & Analytics',
        'Other'
      ],
      message: 'Invalid service type selected'
    },
    validate: {
      validator: function(arr) {
        return arr && arr.length > 0;
      },
      message: 'At least one service type must be selected'
    }
  },
  platformPreference: {
    type: String,
    required: [true, 'Platform preference is required'],
    enum: {
      values: [
        'AWS (Amazon Web Services)',
        'Google Cloud Platform (GCP)',
        'Microsoft Azure',
        'DigitalOcean',
        'Vultr',
        'Linode',
        'Cloudflare',
        'Heroku',
        'Vercel',
        'Netlify',
        'No Preference',
        'Other'
      ],
      message: 'Invalid platform preference'
    }
  },
  storageRequirements: {
    type: String,
    required: [true, 'Storage requirements are required'],
    enum: {
      values: [
        'Up to 10 GB',
        '10-50 GB',
        '50-200 GB',
        '200 GB - 1 TB',
        '1-5 TB',
        '5-20 TB',
        '20+ TB',
        'Not Sure'
      ],
      message: 'Invalid storage requirement'
    }
  },
  trafficRequirements: {
    type: String,
    required: [true, 'Traffic requirements are required'],
    enum: {
      values: [
        'Up to 1,000 visits/month',
        '1K-10K visits/month',
        '10K-100K visits/month',
        '100K-1M visits/month',
        '1M-10M visits/month',
        '10M+ visits/month',
        'Not Sure'
      ],
      message: 'Invalid traffic requirement'
    }
  },
  securityBackupNeeds: {
    type: [String],
    enum: {
      values: [
        'SSL Certificates',
        'DDoS Protection',
        'Regular Backups',
        'Malware Scanning',
        'Firewall Configuration',
        'Security Monitoring',
        'Data Encryption',
        'Compliance (GDPR, HIPAA)',
        'Disaster Recovery',
        'Two-Factor Authentication',
        'Access Control',
        'Vulnerability Assessment',
        'None',
        'Other'
      ],
      message: 'Invalid security/backup need selected'
    }
  },
  budgetRange: {
    type: String,
    required: [true, 'Budget range is required'],
    enum: {
      values: [
        '$50 - $200/month',
        '$200 - $500/month',
        '$500 - $1,000/month',
        '$1,000 - $2,500/month',
        '$2,500 - $5,000/month',
        '$5,000 - $10,000/month',
        '$10,000+/month',
        'One-time project'
      ],
      message: 'Invalid budget range'
    }
  },
  timeline: {
    type: String,
    required: [true, 'Timeline is required'],
    enum: {
      values: [
        'Immediate (ASAP)',
        '1-2 weeks',
        '2-4 weeks',
        '1-2 months',
        '2-3 months',
        '3+ months',
        'Ongoing Support',
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
  // Technical specifications
  operatingSystem: {
    type: String,
    enum: ['Linux (Ubuntu)', 'Linux (CentOS)', 'Linux (Debian)', 'Windows Server', 'No Preference'],
    default: 'No Preference'
  },
  databaseNeeds: {
    type: [String],
    enum: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch', 'No Database', 'Other']
  },
  expectedUsers: {
    type: String,
    enum: [
      '1-100 users',
      '100-1,000 users',
      '1K-10K users',
      '10K-100K users',
      '100K+ users',
      'Not Sure'
    ]
  },
  // Business information
  businessType: {
    type: String,
    trim: true,
    maxlength: [100, 'Business type cannot exceed 100 characters']
  },
  urgencyLevel: {
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
cloudHostingRequestSchema.index({ email: 1 });
cloudHostingRequestSchema.index({ submittedAt: -1 });
cloudHostingRequestSchema.index({ status: 1 });
cloudHostingRequestSchema.index({ platformPreference: 1 });
cloudHostingRequestSchema.index({ serviceType: 1 });
cloudHostingRequestSchema.index({ urgencyLevel: 1 });

// Compound indexes
cloudHostingRequestSchema.index({ status: 1, submittedAt: -1 });
cloudHostingRequestSchema.index({ platformPreference: 1, status: 1 });
cloudHostingRequestSchema.index({ urgencyLevel: 1, status: 1 });

// Pre-save middleware
cloudHostingRequestSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Instance methods
cloudHostingRequestSchema.methods.getEstimatedMonthlyCost = function() {
  const baseCosts = {
    '$50 - $200/month': 125,
    '$200 - $500/month': 350,
    '$500 - $1,000/month': 750,
    '$1,000 - $2,500/month': 1750,
    '$2,500 - $5,000/month': 3750,
    '$5,000 - $10,000/month': 7500,
    '$10,000+/month': 10000,
    'One-time project': 0
  };
  return baseCosts[this.budgetRange] || 0;
};

cloudHostingRequestSchema.methods.isHighPriorityRequest = function() {
  return this.urgencyLevel === 'High' || this.urgencyLevel === 'Critical' || 
         this.timeline === 'Immediate (ASAP)';
};

cloudHostingRequestSchema.methods.requiresComplexSetup = function() {
  const complexServices = [
    'Cloud Setup & Migration',
    'DevOps Services',
    'Database Management',
    'Performance Optimization'
  ];
  return this.serviceType.some(service => complexServices.includes(service));
};

// Static methods
cloudHostingRequestSchema.statics.getDashboardStats = async function() {
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

cloudHostingRequestSchema.statics.getPlatformStats = async function() {
  return this.aggregate([
    {
      $group: {
        _id: '$platformPreference',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
};

cloudHostingRequestSchema.statics.getUrgencyStats = async function() {
  return this.aggregate([
    {
      $group: {
        _id: '$urgencyLevel',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
};

module.exports = mongoose.model('CloudHostingRequest', cloudHostingRequestSchema);
