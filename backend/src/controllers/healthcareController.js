const HealthcareRequest = require('../models/HealthcareRequest');

const submitHealthcareRequest = async (req, res) => {
  try {
    const healthcareRequest = new HealthcareRequest(req.body);
    await healthcareRequest.save();
    
    res.status(201).json({
      success: true,
      message: 'Healthcare request submitted successfully',
      data: {
        id: healthcareRequest._id,
        submittedAt: healthcareRequest.submittedAt,
        urgencyLevel: healthcareRequest.urgencyLevel,
        estimatedBudget: healthcareRequest.getEstimatedBudget(),
        isComplexProject: healthcareRequest.isComplexProject(),
        isEnterpriseProject: healthcareRequest.isEnterpriseProject(),
        requiresHIPAACompliance: healthcareRequest.requiresHIPAACompliance()
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error submitting healthcare request:', error);
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        path: err.path,
        msg: err.message
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors,
        timestamp: new Date().toISOString()
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to submit healthcare request',
      timestamp: new Date().toISOString()
    });
  }
};

const getAllHealthcareRequests = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      solutionType,
      facilityType,
      numberOfDoctorsStaff,
      budgetRange,
      urgencyLevel,
      sortBy = 'submittedAt', 
      sortOrder = 'desc' 
    } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (solutionType) query.solutionType = { $in: solutionType.split(',') };
    if (facilityType) query.facilityType = facilityType;
    if (numberOfDoctorsStaff) query.numberOfDoctorsStaff = numberOfDoctorsStaff;
    if (budgetRange) query.budgetRange = budgetRange;
    if (urgencyLevel) query.urgencyLevel = urgencyLevel;
    
    const requests = await HealthcareRequest.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const total = await HealthcareRequest.countDocuments(query);
    
    res.status(200).json({
      success: true,
      message: 'Healthcare requests retrieved successfully',
      data: {
        requests,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalRequests: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching healthcare requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch healthcare requests',
      timestamp: new Date().toISOString()
    });
  }
};

const getHealthcareRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID format',
        timestamp: new Date().toISOString()
      });
    }
    
    const request = await HealthcareRequest.findById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Healthcare request not found',
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Healthcare request retrieved successfully',
      data: {
        ...request.toObject(),
        estimatedBudget: request.getEstimatedBudget(),
        isComplexProject: request.isComplexProject(),
        isEnterpriseProject: request.isEnterpriseProject(),
        requiresHIPAACompliance: request.requiresHIPAACompliance()
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching healthcare request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch healthcare request',
      timestamp: new Date().toISOString()
    });
  }
};

const updateHealthcareRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID format',
        timestamp: new Date().toISOString()
      });
    }
    
    const validStatuses = ['pending', 'reviewed', 'in-progress', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value. Must be one of: ' + validStatuses.join(', '),
        timestamp: new Date().toISOString()
      });
    }
    
    const request = await HealthcareRequest.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Healthcare request not found',
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Healthcare request status updated successfully',
      data: {
        id: request._id,
        status: request.status,
        updatedAt: request.updatedAt
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating healthcare request status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update healthcare request status',
      timestamp: new Date().toISOString()
    });
  }
};

// ✅ NEW DELETE FUNCTION
const deleteHealthcareRequest = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID format',
        timestamp: new Date().toISOString()
      });
    }

    const deleted = await HealthcareRequest.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Healthcare request not found',
        timestamp: new Date().toISOString()
      });
    }

    res.status(200).json({
      success: true,
      message: 'Healthcare request deleted successfully',
      data: { id },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error deleting healthcare request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete healthcare request',
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = {
  submitHealthcareRequest,
  getAllHealthcareRequests,
  getHealthcareRequestById,
  updateHealthcareRequestStatus,
  deleteHealthcareRequest
};
