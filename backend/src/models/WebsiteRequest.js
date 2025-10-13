const mongoose = require('mongoose');

const websiteRequestSchema = new mongoose.Schema({
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
  websiteType: {
    type: String,
    required: [true, 'Website type is required'],
    enum: {
      values: ['Portfolio', 'Business', 'E-commerce', 'Blog', 'Non-profit', 'Educational', 'Healthcare', 'Real Estate', 'Restaurant/Food', 'Other'],
      message: 'Website type must be one of: Portfolio, Business, E-commerce, Blog, Non-profit, Educational, Healthcare, Real Estate, Restaurant/Food, Other'
    }
  },
  preferredTechnology: {
    type: String,
    required: [true, 'Preferred technology is required'],
    enum: {
      values: ['WordPress', 'React', 'Next.js', 'Vue.js', 'Angular', 'Shopify', 'Wix', 'Custom Development', 'No Preference'],
      message: 'Preferred technology must be one of: WordPress, React, Next.js, Vue.js, Angular, Shopify, Wix, Custom Development, No Preference'
    }
  },
  numberOfPages: {
    type: String,
    required: [true, 'Number of pages is required'],
    trim: true,
    maxlength: [50, 'Number of pages cannot exceed 50 characters']
  },
  designStyle: {
    type: String,
    required: [true, 'Design style is required'],
    enum: {
      values: ['Modern', 'Minimal', 'Corporate', 'Creative', 'Professional', 'Elegant', 'Bold', 'Vintage', 'Industrial'],
      message: 'Design style must be one of: Modern, Minimal, Corporate, Creative, Professional, Elegant, Bold, Vintage, Industrial'
    }
  },
  budgetRange: {
    type: String,
    required: [true, 'Budget range is required'],
    enum: {
      values: ['$500 - $1,000', '$1,000 - $2,500', '$2,500 - $5,000', '$5,000 - $10,000', '$10,000 - $25,000', '$25,000+'],
      message: 'Budget range must be one of the specified ranges'
    }
  },
  projectDeadline: {
    type: Date,
    required: [true, 'Project deadline is required'],
    validate: {
      validator: function(date) {
        return date > new Date();
      },
      message: 'Project deadline must be in the future'
    }
  },
  additionalRequirements: {
    type: String,
    trim: true,
    maxlength: [1000, 'Additional requirements cannot exceed 1000 characters'],
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
  timestamps: true // This automatically adds createdAt and updatedAt
});

// Indexes for better query performance
websiteRequestSchema.index({ email: 1 });
websiteRequestSchema.index({ submittedAt: -1 });
websiteRequestSchema.index({ status: 1 });
websiteRequestSchema.index({ websiteType: 1 });
websiteRequestSchema.index({ budgetRange: 1 });
websiteRequestSchema.index({ projectDeadline: 1 });

// Compound indexes for common queries
websiteRequestSchema.index({ status: 1, submittedAt: -1 });
websiteRequestSchema.index({ websiteType: 1, status: 1 });

// Virtual for formatted deadline
websiteRequestSchema.virtual('formattedDeadline').get(function() {
  return this.projectDeadline.toLocaleDateString();
});

// Virtual for days until deadline
websiteRequestSchema.virtual('daysUntilDeadline').get(function() {
  const now = new Date();
  const deadline = new Date(this.projectDeadline);
  const diffTime = deadline - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Pre-save middleware to update the updatedAt field
websiteRequestSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Pre-update middleware
websiteRequestSchema.pre(['updateOne', 'findOneAndUpdate'], function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

// Instance method to check if request is overdue
websiteRequestSchema.methods.isOverdue = function() {
  return new Date() > this.projectDeadline && this.status !== 'completed';
};

// Instance method to get status color for UI
websiteRequestSchema.methods.getStatusColor = function() {
  const colors = {
    'pending': '#FFA500',     // Orange
    'reviewed': '#0000FF',    // Blue
    'in-progress': '#FFFF00', // Yellow
    'completed': '#008000'    // Green
  };
  return colors[this.status] || '#808080'; // Gray for unknown status
};

// Static method to find requests by status
websiteRequestSchema.statics.findByStatus = function(status) {
  return this.find({ status }).sort({ submittedAt: -1 });
};

// Static method to find overdue requests
websiteRequestSchema.statics.findOverdue = function() {
  return this.find({
    projectDeadline: { $lt: new Date() },
    status: { $ne: 'completed' }
  }).sort({ projectDeadline: 1 });
};

// Static method for dashboard stats
websiteRequestSchema.statics.getDashboardStats = async function() {
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

module.exports = mongoose.model('WebsiteRequest', websiteRequestSchema);
