const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  // Project Reference
  projectId: {
    type: String,
    required: [true, 'Project ID is required'],
    index: true
  },
  projectType: {
    type: String,
    required: [true, 'Project type is required'],
    enum: {
      values: [
        'website',
        'mobile',
        'cloud',
        'crm',
        'hrms',
        'ai',
        'digital',
        'lms',
        'ecommerce',
        'branding',
        'saas',
        'healthcare'
      ],
      message: 'Invalid project type'
    }
  },
  projectName: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true
  },
  clientName: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true
  },
  clientEmail: {
    type: String,
    required: [true, 'Client email is required'],
    trim: true,
    lowercase: true
  },

  // Payment Details
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: [0, 'Amount must be positive']
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'INR', 'EUR', 'GBP'],
    uppercase: true
  },
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: {
      values: [
        'Bank Transfer',
        'Credit Card',
        'Debit Card',
        'UPI',
        'PayPal',
        'Stripe',
        'Cash',
        'Check',
        'Wire Transfer',
        'Cryptocurrency',
        'Other'
      ],
      message: 'Invalid payment method'
    }
  },
  paymentStatus: {
    type: String,
    enum: {
      values: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      message: 'Invalid payment status'
    },
    default: 'pending'
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date
  },
  invoiceNumber: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  transactionId: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },

  // Budget Information
  projectBudget: {
    type: String,
    trim: true
  },
  totalProjectValue: {
    type: Number,
    min: 0
  },
  paidAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  remainingAmount: {
    type: Number,
    min: 0
  },

  // System fields
  createdBy: {
    type: String,
    default: 'admin'
  },
  updatedBy: {
    type: String,
    default: 'admin'
  }
}, {
  timestamps: true
});

// Indexes
paymentSchema.index({ projectId: 1, projectType: 1 });
paymentSchema.index({ clientEmail: 1 });
paymentSchema.index({ paymentStatus: 1 });
paymentSchema.index({ paymentDate: -1 });
paymentSchema.index({ createdAt: -1 });

// Pre-save hook to calculate remaining amount
paymentSchema.pre('save', function(next) {
  if (this.totalProjectValue && this.amount) {
    this.remainingAmount = Math.max(0, this.totalProjectValue - (this.paidAmount + this.amount));
  }
  next();
});

// Instance methods
paymentSchema.methods.getFormattedAmount = function() {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: this.currency || 'USD'
  });
  return formatter.format(this.amount);
};

// Static methods
paymentSchema.statics.getRevenueStats = async function() {
  const stats = await this.aggregate([
    {
      $match: {
        paymentStatus: 'completed'
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$amount' },
        totalPayments: { $sum: 1 },
        averagePayment: { $avg: '$amount' }
      }
    }
  ]);

  return stats[0] || { totalRevenue: 0, totalPayments: 0, averagePayment: 0 };
};

paymentSchema.statics.getPaymentsByProjectType = async function() {
  return this.aggregate([
    {
      $match: {
        paymentStatus: 'completed'
      }
    },
    {
      $group: {
        _id: '$projectType',
        totalRevenue: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { totalRevenue: -1 }
    }
  ]);
};

paymentSchema.statics.getMonthlyRevenue = async function() {
  return this.aggregate([
    {
      $match: {
        paymentStatus: 'completed'
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$paymentDate' },
          month: { $month: '$paymentDate' }
        },
        revenue: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ]);
};

module.exports = mongoose.model('Payment', paymentSchema);

