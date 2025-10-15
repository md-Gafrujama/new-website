const mongoose = require('mongoose');

const healthcareRequestSchema = new mongoose.Schema({
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
  clinicHospitalName: {
    type: String,
    required: [true, 'Clinic/Hospital name is required'],
    trim: true,
    maxlength: [150, 'Clinic/Hospital name cannot exceed 150 characters']
  },

  // Solution Type
  solutionType: {
    type: [String],
    required: [true, 'At least one solution type is required'],
    enum: {
      values: [
        'Appointment Booking System',
        'Electronic Medical Records (EMR)',
        'Electronic Health Records (EHR)',
        'Patient Management System',
        'Hospital Management System (HMS)',
        'Practice Management System',
        'Telemedicine Platform',
        'Patient Portal',
        'Doctor Portal',
        'Pharmacy Management',
        'Laboratory Management',
        'Radiology Information System',
        'Billing & Insurance System',
        'Claims Management',
        'Inventory Management',
        'Staff Management',
        'Mobile App for Patients',
        'Mobile App for Doctors',
        'Queue Management',
        'Emergency Management',
        'Bed Management',
        'Operation Theater Management',
        'Ambulance Management',
        'Medical Equipment Management',
        'Other'
      ],
      message: 'Invalid solution type selected'
    },
    validate: {
      validator: function(arr) {
        return arr && arr.length > 0;
      },
      message: 'At least one solution type must be selected'
    }
  },

  // Staff Information
  numberOfDoctorsStaff: {
    type: String,
    required: [true, 'Number of doctors/staff is required'],
    enum: {
      values: [
        '1-5',
        '6-15',
        '16-30',
        '31-50',
        '51-100',
        '101-250',
        '250+',
        'Not Sure'
      ],
      message: 'Invalid number of doctors/staff range'
    }
  },

  // Required Features
  requiredFeatures: {
    type: [String],
    required: [true, 'At least one feature is required'],
    enum: {
      values: [
        'Online Appointment Booking',
        'Appointment Scheduling',
        'Patient Registration',
        'Patient Check-in/Check-out',
        'Electronic Medical Records',
        'Prescription Management',
        'Medical History Tracking',
        'Lab Results Management',
        'Radiology Reports',
        'Billing & Invoicing',
        'Insurance Claims',
        'Payment Processing',
        'Inventory Management',
        'Staff Scheduling',
        'Patient Communication',
        'SMS/Email Notifications',
        'Appointment Reminders',
        'WhatsApp Integration',
        'Video Consultation',
        'Telemedicine',
        'Patient Portal Access',
        'Doctor Portal Access',
        'Mobile App',
        'Queue Management',
        'Walk-in Management',
        'Emergency Booking',
        'Multi-location Support',
        'Analytics & Reporting',
        'HIPAA Compliance',
        'Data Security',
        'Backup & Recovery',
        'Multi-language Support',
        'Medical Certificate Generation',
        'Referral Management',
        'Follow-up Management',
        'Vital Signs Tracking',
        'Medication Management',
        'Allergy Management',
        'Chronic Disease Management',
        'Vaccination Records',
        'Bed Management',
        'OPD Management',
        'IPD Management',
        'ICU Management',
        'Operation Theater Booking',
        'Equipment Management',
        'Ambulance Booking',
        'Blood Bank Management',
        'Dietary Management',
        'Discharge Management',
        'Death Certificate',
        'Medical Audit',
        'Quality Control',
        'Accreditation Support',
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
  integrationRequirements: {
    type: [String],
    enum: {
      values: [
        'Payment Gateways',
        'SMS Services',
        'WhatsApp Business API',
        'Email Services',
        'Insurance APIs',
        'Government Health APIs',
        'Laboratory Systems',
        'Pharmacy Systems',
        'Radiology Systems',
        'Hospital Equipment',
        'Accounting Software',
        'Banking Systems',
        'Video Call Platforms (Zoom, Teams)',
        'Cloud Storage',
        'Backup Systems',
        'Security Systems',
        'Biometric Systems',
        'ID Card Systems',
        'RFID Systems',
        'Barcode Systems',
        'POS Systems',
        'CRM Systems',
        'ERP Systems',
        'PACS (Picture Archiving)',
        'RIS (Radiology Information System)',
        'LIS (Laboratory Information System)',
        'HIS (Hospital Information System)',
        'Telehealth Platforms',
        'Wearable Devices',
        'IoT Medical Devices',
        'AI/ML Analytics',
        'Custom APIs',
        'None',
        'Other'
      ],
      message: 'Invalid integration requirement'
    }
  },

  // Healthcare Specific Fields
  facilityType: {
    type: String,
    enum: {
      values: [
        'Private Clinic',
        'Multi-specialty Clinic',
        'Hospital',
        'Multi-specialty Hospital',
        'Specialty Hospital',
        'Diagnostic Center',
        'Dental Clinic',
        'Eye Care Center',
        'Skin Care Center',
        'Physiotherapy Center',
        'Maternity Center',
        'Pediatric Center',
        'Mental Health Center',
        'Rehabilitation Center',
        'Emergency Care',
        'Urgent Care',
        'Nursing Home',
        'Home Healthcare',
        'Telemedicine Center',
        'Mobile Clinic',
        'Corporate Health Center',
        'Government Hospital',
        'NGO/Charitable Hospital',
        'Research Institute',
        'Medical College Hospital',
        'Other'
      ],
      message: 'Invalid facility type'
    }
  },
  specialties: {
    type: [String],
    enum: {
      values: [
        'General Medicine',
        'Internal Medicine',
        'Family Medicine',
        'Pediatrics',
        'Obstetrics & Gynecology',
        'Surgery',
        'Orthopedics',
        'Cardiology',
        'Neurology',
        'Dermatology',
        'Ophthalmology',
        'ENT',
        'Psychiatry',
        'Radiology',
        'Pathology',
        'Anesthesiology',
        'Emergency Medicine',
        'Oncology',
        'Urology',
        'Gastroenterology',
        'Pulmonology',
        'Endocrinology',
        'Nephrology',
        'Rheumatology',
        'Infectious Diseases',
        'Geriatrics',
        'Sports Medicine',
        'Pain Management',
        'Physical Medicine',
        'Plastic Surgery',
        'Dentistry',
        'Physiotherapy',
        'Nursing',
        'Pharmacy',
        'Other'
      ],
      message: 'Invalid specialty'
    }
  },
  patientVolume: {
    type: String,
    enum: {
      values: [
        '1-50 patients/day',
        '51-100 patients/day',
        '101-200 patients/day',
        '201-500 patients/day',
        '500+ patients/day',
        'Not Sure'
      ]
    }
  },

  // Compliance and Security
  complianceRequirements: {
    type: [String],
    enum: {
      values: [
        'HIPAA Compliance',
        'HITECH Compliance',
        'FDA Compliance',
        'Joint Commission Standards',
        'ISO 27001',
        'SOC 2 Compliance',
        'GDPR Compliance',
        'Local Health Regulations',
        'Medical Board Requirements',
        'Insurance Board Requirements',
        'Government Health Standards',
        'International Standards',
        'Accreditation Requirements',
        'None Specified',
        'Other'
      ],
      message: 'Invalid compliance requirement'
    }
  },
  dataSecurityNeeds: {
    type: [String],
    enum: {
      values: [
        'End-to-end Encryption',
        'Data Backup & Recovery',
        'Access Control',
        'Audit Trails',
        'Role-based Permissions',
        'Two-factor Authentication',
        'Biometric Authentication',
        'Digital Signatures',
        'Secure File Sharing',
        'VPN Access',
        'Firewall Protection',
        'Anti-virus Protection',
        'Regular Security Updates',
        'Penetration Testing',
        'Security Training',
        'Incident Response Plan',
        'Data Anonymization',
        'Secure APIs',
        'Cloud Security',
        'On-premise Security'
      ]
    }
  },

  // Technical Requirements
  deploymentPreference: {
    type: String,
    enum: {
      values: ['Cloud-based', 'On-premise', 'Hybrid', 'Mobile-first', 'No Preference'],
      message: 'Invalid deployment preference'
    },
    default: 'Cloud-based'
  },
  platformRequirements: {
    type: [String],
    enum: {
      values: [
        'Web Application',
        'Desktop Application',
        'Mobile App (iOS)',
        'Mobile App (Android)',
        'Tablet App',
        'Kiosk Application',
        'API Integration',
        'Wearable App',
        'Smart TV App'
      ]
    }
  },

  // Budget and Timeline
  budgetRange: {
    type: String,
    required: [true, 'Budget range is required'],
    enum: {
      values: [
        '$3,000 - $8,000',
        '$8,000 - $20,000',
        '$20,000 - $40,000',
        '$40,000 - $80,000',
        '$80,000 - $150,000',
        '$150,000 - $300,000',
        '$300,000+'
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
        'Emergency Support',
        'On-site Support',
        'Remote Support',
        'Phone Support',
        'Email Support',
        'Live Chat Support',
        'Training & Onboarding',
        'User Manuals',
        'Video Tutorials',
        'Regular Updates',
        'System Maintenance',
        'Data Migration',
        'Hardware Support',
        'Software Support',
        'Dedicated Account Manager'
      ]
    }
  },

  // Contact Information
  contactRole: {
    type: String,
    enum: [
      'Doctor/Physician',
      'Hospital Administrator',
      'Practice Manager',
      'IT Manager',
      'CTO/Technical Lead',
      'Healthcare Consultant',
      'Department Head',
      'Medical Director',
      'Nursing Supervisor',
      'Operations Manager',
      'Business Owner',
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
healthcareRequestSchema.index({ email: 1 });
healthcareRequestSchema.index({ submittedAt: -1 });
healthcareRequestSchema.index({ status: 1 });
healthcareRequestSchema.index({ solutionType: 1 });
healthcareRequestSchema.index({ facilityType: 1 });
healthcareRequestSchema.index({ budgetRange: 1 });
healthcareRequestSchema.index({ urgencyLevel: 1 });

// Pre-save middleware
healthcareRequestSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Instance methods
healthcareRequestSchema.methods.getEstimatedBudget = function() {
  const budgetRanges = {
    '$3,000 - $8,000': 5500,
    '$8,000 - $20,000': 14000,
    '$20,000 - $40,000': 30000,
    '$40,000 - $80,000': 60000,
    '$80,000 - $150,000': 115000,
    '$150,000 - $300,000': 225000,
    '$300,000+': 300000
  };
  return budgetRanges[this.budgetRange] || 0;
};

healthcareRequestSchema.methods.isComplexProject = function() {
  return this.solutionType.length > 3 ||
         this.requiredFeatures.length > 15 ||
         this.integrationRequirements.length > 8 ||
         this.complianceRequirements.length > 3;
};

healthcareRequestSchema.methods.isEnterpriseProject = function() {
  const enterpriseStaff = ['101-250', '250+'];
  const enterpriseBudgets = ['$150,000 - $300,000', '$300,000+'];
  const enterpriseFacilities = ['Hospital', 'Multi-specialty Hospital', 'Medical College Hospital'];
  
  return enterpriseStaff.includes(this.numberOfDoctorsStaff) ||
         enterpriseBudgets.includes(this.budgetRange) ||
         enterpriseFacilities.includes(this.facilityType);
};

healthcareRequestSchema.methods.requiresHIPAACompliance = function() {
  return this.complianceRequirements && 
         this.complianceRequirements.includes('HIPAA Compliance');
};

// Static methods
healthcareRequestSchema.statics.getDashboardStats = async function() {
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

module.exports = mongoose.model('HealthcareRequest', healthcareRequestSchema);
