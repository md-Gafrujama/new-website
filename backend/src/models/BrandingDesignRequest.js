const mongoose = require('mongoose');

const brandingDesignRequestSchema = new mongoose.Schema({
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
  brandName: {
    type: String,
    required: [true, 'Brand/Company name is required'],
    trim: true,
    maxlength: [100, 'Brand name cannot exceed 100 characters']
  },

  // Design Requirements
  designType: {
    type: [String],
    required: [true, 'At least one design type is required'],
    enum: {
      values: [
        'Logo Design',
        'Banner Design',
        'UI/UX Design',
        'Website Design',
        'App Design',
        'Brochure Design',
        'Business Card',
        'Social Media Kit',
        'Print Design',
        'Packaging Design',
        'Brand Guidelines',
        'Presentation Design',
        'Infographics',
        'Video Graphics',
        'Email Templates',
        'Stationery',
        'T-shirt/Merchandise',
        'Vehicle Wrap',
        'Trade Show Booth',
        'Other'
      ],
      message: 'Invalid design type selected'
    },
    validate: {
      validator: function(arr) {
        return arr && arr.length > 0;
      },
      message: 'At least one design type must be selected'
    }
  },
  brandColors: {
    type: String,
    trim: true,
    maxlength: [200, 'Brand colors cannot exceed 200 characters'],
    default: ''
  },
  brandGuidelines: {
    type: String,
    trim: true,
    maxlength: [1000, 'Brand guidelines cannot exceed 1000 characters'],
    default: ''
  },
  designStylePreference: {
    type: String,
    required: [true, 'Design style preference is required'],
    enum: {
      values: [
        'Modern/Contemporary',
        'Minimal/Clean',
        'Corporate/Professional',
        'Creative/Artistic',
        'Vintage/Retro',
        'Elegant/Luxury',
        'Bold/Dynamic',
        'Playful/Fun',
        'Traditional/Classic',
        'Natural/Organic',
        'Abstract/Geometric',
        'Futuristic/Tech',
        'Grunge/Urban',
        'Hand-drawn/Illustrative',
        'Custom Style',
        'No Preference'
      ],
      message: 'Invalid design style preference'
    }
  },

  // Deliverables
  deliverablesRequired: {
    type: [String],
    required: [true, 'At least one deliverable is required'],
    enum: {
      values: [
        'Logo Pack (PNG, JPG, SVG)',
        'Brand Guidelines',
        'Social Media Kit',
        'Business Card Design',
        'Letterhead Design',
        'Email Signature',
        'Web Graphics',
        'Print Files',
        'Source Files (AI, PSD)',
        'Brand Manual',
        'Presentation Template',
        'Packaging Mockups',
        'Marketing Materials',
        'UI Kit',
        'UX Wireframes',
        'Prototypes',
        'Animated Logo',
        'Custom Icons',
        'Brand Pattern',
        'Other'
      ],
      message: 'Invalid deliverable selected'
    },
    validate: {
      validator: function(arr) {
        return arr && arr.length > 0;
      },
      message: 'At least one deliverable must be selected'
    }
  },

  // Budget and Timeline
  budgetRange: {
    type: String,
    required: [true, 'Budget range is required'],
    enum: {
      values: [
        '$200 - $500',
        '$500 - $1,000',
        '$1,000 - $2,500',
        '$2,500 - $5,000',
        '$5,000 - $10,000',
        '$10,000 - $25,000',
        '$25,000+'
      ],
      message: 'Invalid budget range'
    }
  },
  timeline: {
    type: String,
    required: [true, 'Timeline is required'],
    enum: {
      values: [
        '1-2 weeks',
        '2-4 weeks',
        '1-2 months',
        '2-3 months',
        '3-6 months',
        '6+ months',
        'ASAP/Urgent'
      ],
      message: 'Invalid timeline'
    }
  },

  // Additional Information
  additionalNotes: {
    type: String,
    trim: true,
    maxlength: [2000, 'Additional notes cannot exceed 2000 characters'],
    default: ''
  },
  targetAudience: {
    type: String,
    trim: true,
    maxlength: [500, 'Target audience cannot exceed 500 characters']
  },
  keyCompetitors: {
    type: [String],
    default: []
  },
  designInspiration: {
    type: [String],
    default: []
  },
  projectObjective: {
    type: String,
    trim: true,
    maxlength: [1000, 'Project objective cannot exceed 1000 characters']
  },
  contactRole: {
    type: String,
    enum: [
      'Business Owner',
      'Marketing Manager',
      'Product Manager',
      'Creative Director',
      'Art Director',
      'Project Manager',
      'Other'
    ]
  },
  urgencyLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
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
brandingDesignRequestSchema.index({ email: 1 });
brandingDesignRequestSchema.index({ submittedAt: -1 });
brandingDesignRequestSchema.index({ status: 1 });
brandingDesignRequestSchema.index({ designType: 1 });
brandingDesignRequestSchema.index({ budgetRange: 1 });
brandingDesignRequestSchema.index({ urgencyLevel: 1 });

// Pre-save middleware
brandingDesignRequestSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Instance methods
brandingDesignRequestSchema.methods.getEstimatedBudget = function() {
  const budgetRanges = {
    '$200 - $500': 350,
    '$500 - $1,000': 750,
    '$1,000 - $2,500': 1750,
    '$2,500 - $5,000': 3750,
    '$5,000 - $10,000': 7500,
    '$10,000 - $25,000': 17500,
    '$25,000+': 25000
  };
  return budgetRanges[this.budgetRange] || 0;
};

brandingDesignRequestSchema.methods.isHighValueProject = function() {
  const highValueBudgets = ['$10,000 - $25,000', '$25,000+'];
  return highValueBudgets.includes(this.budgetRange);
};

brandingDesignRequestSchema.methods.isUrgentRequest = function() {
  return this.urgencyLevel === 'High' || this.urgencyLevel === 'Critical' || 
         this.timeline === 'ASAP/Urgent';
};

brandingDesignRequestSchema.methods.isComplexRequest = function() {
  return this.designType.length > 3 ||
         this.deliverablesRequired.length > 5 ||
         this.designStylePreference === 'Custom Style';
};

// Static methods
brandingDesignRequestSchema.statics.getDashboardStats = async function() {
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

module.exports = mongoose.model('BrandingDesignRequest', brandingDesignRequestSchema);
