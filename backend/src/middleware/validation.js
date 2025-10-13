const { body, validationResult } = require('express-validator');

// Website request validation rules
const websiteRequestValidation = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  
  body('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .isLength({ max: 255 })
    .withMessage('Email cannot exceed 255 characters'),
  
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .isLength({ min: 10, max: 20 })
    .withMessage('Phone number must be between 10 and 20 characters'),
  
  body('businessName')
    .trim()
    .notEmpty()
    .withMessage('Business name is required')
    .isLength({ min: 2, max: 150 })
    .withMessage('Business name must be between 2 and 150 characters'),
  
  body('websiteType')
    .notEmpty()
    .withMessage('Website type is required')
    .isIn(['Portfolio', 'Business', 'E-commerce', 'Blog', 'Non-profit', 'Educational', 'Healthcare', 'Real Estate', 'Restaurant/Food', 'Other'])
    .withMessage('Invalid website type'),
  
  body('preferredTechnology')
    .notEmpty()
    .withMessage('Preferred technology is required')
    .isIn(['WordPress', 'React', 'Next.js', 'Vue.js', 'Angular', 'Shopify', 'Wix', 'Custom Development', 'No Preference'])
    .withMessage('Invalid preferred technology'),
  
  body('numberOfPages')
    .trim()
    .notEmpty()
    .withMessage('Number of pages is required')
    .isLength({ max: 50 })
    .withMessage('Number of pages cannot exceed 50 characters'),
  
  body('designStyle')
    .notEmpty()
    .withMessage('Design style is required')
    .isIn(['Modern', 'Minimal', 'Corporate', 'Creative', 'Professional', 'Elegant', 'Bold', 'Vintage', 'Industrial'])
    .withMessage('Invalid design style'),
  
  body('budgetRange')
    .notEmpty()
    .withMessage('Budget range is required')
    .isIn(['$500 - $1,000', '$1,000 - $2,500', '$2,500 - $5,000', '$5,000 - $10,000', '$10,000 - $25,000', '$25,000+'])
    .withMessage('Invalid budget range'),
  
  body('projectDeadline')
    .isISO8601()
    .withMessage('Please enter a valid date in ISO format (YYYY-MM-DD)')
    .custom((value) => {
      const deadline = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (deadline <= today) {
        throw new Error('Project deadline must be in the future');
      }
      return true;
    }),
  
  body('additionalRequirements')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Additional requirements cannot exceed 1000 characters')
];

// Status update validation
const statusUpdateValidation = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['pending', 'reviewed', 'in-progress', 'completed'])
    .withMessage('Status must be one of: pending, reviewed, in-progress, completed')
];

// Error handling middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
      timestamp: new Date().toISOString()
    });
  }
  next();
};

module.exports = {
  websiteRequestValidation,
  statusUpdateValidation,
  handleValidationErrors
};
