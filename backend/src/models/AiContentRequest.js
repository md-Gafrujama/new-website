const mongoose = require('mongoose');

const aiContentRequestSchema = new mongoose.Schema({
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
  contentType: {
    type: [String],
    required: [true, 'At least one content type is required'],
    enum: {
      values: [
        'Blog Articles',
        'Social Media Posts',
        'Product Descriptions',
        'Email Marketing',
        'Website Content',
        'Ad Copy',
        'Press Releases',
        'Technical Documentation',
        'SEO Content',
        'Video Scripts',
        'Podcast Scripts',
        'News Articles',
        'Case Studies',
        'White Papers',
        'Landing Pages',
        'Meta Descriptions',
        'Social Media Captions',
        'Newsletter Content',
        'eBook Content',
        'Other'
      ],
      message: 'Invalid content type selected'
    },
    validate: {
      validator: function(arr) {
        return arr && arr.length > 0;
      },
      message: 'At least one content type must be selected'
    }
  },
  aiToolPreference: {
    type: String,
    enum: {
      values: [
        'ChatGPT/OpenAI',
        'Google Bard',
        'Claude (Anthropic)',
        'Jasper AI',
        'Copy.ai',
        'Writesonic',
        'ContentBot',
        'Rytr',
        'Anyword',
        'Grammarly',
        'Custom Solution',
        'No Preference'
      ],
      message: 'Invalid AI tool preference'
    },
    default: 'No Preference'
  },
  contentVolumePerMonth: {
    type: String,
    required: [true, 'Content volume is required'],
    enum: {
      values: [
        '1-10 pieces',
        '11-25 pieces',
        '26-50 pieces',
        '51-100 pieces',
        '101-200 pieces',
        '201-500 pieces',
        '500+ pieces'
      ],
      message: 'Invalid content volume'
    }
  },
  languagesRequired: {
    type: [String],
    required: [true, 'At least one language is required'],
    enum: {
      values: [
        'English',
        'Spanish',
        'French',
        'German',
        'Italian',
        'Portuguese',
        'Chinese (Mandarin)',
        'Japanese',
        'Korean',
        'Arabic',
        'Hindi',
        'Russian',
        'Dutch',
        'Swedish',
        'Norwegian',
        'Danish',
        'Polish',
        'Turkish',
        'Thai',
        'Vietnamese',
        'Other'
      ],
      message: 'Invalid language selected'
    },
    validate: {
      validator: function(arr) {
        return arr && arr.length > 0;
      },
      message: 'At least one language must be selected'
    }
  },
  automationRequirements: {
    type: [String],
    enum: {
      values: [
        'Auto Publishing',
        'Content Scheduling',
        'SEO Optimization',
        'Keyword Integration',
        'Brand Voice Consistency',
        'Multi-platform Distribution',
        'Performance Tracking',
        'Content Approval Workflow',
        'Plagiarism Detection',
        'Content Personalization',
        'A/B Testing',
        'Social Media Integration',
        'Email Campaign Integration',
        'Analytics Integration',
        'Content Calendar Management',
        'Automated Proofreading',
        'Image Generation',
        'Video Content Creation',
        'None',
        'Other'
      ],
      message: 'Invalid automation requirement selected'
    }
  },
  budgetRange: {
    type: String,
    required: [true, 'Budget range is required'],
    enum: {
      values: [
        '$500 - $1,000',
        '$1,000 - $2,500',
        '$2,500 - $5,000',
        '$5,000 - $10,000',
        '$10,000 - $20,000',
        '$20,000 - $50,000',
        '$50,000+'
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
        'Ongoing'
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
  targetAudience: {
    type: String,
    trim: true,
    maxlength: [300, 'Target audience cannot exceed 300 characters']
  },
  contentGoals: {
    type: [String],
    enum: [
      'Increase Website Traffic',
      'Generate Leads',
      'Build Brand Awareness',
      'Improve SEO Rankings',
      'Drive Sales',
      'Educate Customers',
      'Engage Social Media Audience',
      'Support Customer Service',
      'Establish Thought Leadership',
      'Other'
    ]
  },
  contentTone: {
    type: String,
    enum: [
      'Professional',
      'Casual',
      'Friendly',
      'Authoritative',
      'Conversational',
      'Technical',
      'Creative',
      'Humorous',
      'Formal',
      'Educational'
    ],
    default: 'Professional'
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
      'Marketing',
      'Legal',
      'Travel',
      'Food & Beverage',
      'Fashion',
      'Automotive',
      'Entertainment',
      'Other'
    ]
  },
  competitorAnalysis: {
    type: Boolean,
    default: false
  },
  seoRequirements: {
    type: [String],
    enum: [
      'Keyword Research',
      'On-page SEO',
      'Meta Tags',
      'Schema Markup',
      'Internal Linking',
      'Content Optimization',
      'Local SEO',
      'Technical SEO',
      'None'
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
aiContentRequestSchema.index({ email: 1 });
aiContentRequestSchema.index({ submittedAt: -1 });
aiContentRequestSchema.index({ status: 1 });
aiContentRequestSchema.index({ contentType: 1 });
aiContentRequestSchema.index({ aiToolPreference: 1 });
aiContentRequestSchema.index({ priority: 1 });

module.exports = mongoose.model('AiContentRequest', aiContentRequestSchema);
