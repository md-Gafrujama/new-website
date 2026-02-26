const mongoose = require('mongoose');

const videoEditingRequestSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true, match: [/^\S+@\S+\.\S+$/], maxlength: 255 },
  phone: { type: String, required: true, trim: true, minlength: 10, maxlength: 20 },
  serviceType: { type: String, required: true, enum: ['Video Editing', '3D Animation', 'Both'] },
  projectDescription: { type: String, required: true, trim: true, maxlength: 2000 },
  timeline: { type: String, trim: true, maxlength: 100, default: '' },
  budgetRange: { type: String, trim: true, maxlength: 100, default: '' },
  additionalNotes: { type: String, trim: true, maxlength: 1000, default: '' },
  status: { type: String, enum: ['pending', 'reviewed', 'in-progress', 'completed'], default: 'pending' },
  submittedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

videoEditingRequestSchema.index({ email: 1 });
videoEditingRequestSchema.index({ submittedAt: -1 });
videoEditingRequestSchema.index({ status: 1 });

videoEditingRequestSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('VideoEditingRequest', videoEditingRequestSchema);
