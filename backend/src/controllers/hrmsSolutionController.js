const HrmsSolutionRequest = require('../models/HrmsSolutionRequest');

const submitHrmsSolutionRequest = async (req, res) => {
  try {
    const hrmsSolutionRequest = new HrmsSolutionRequest(req.body);
    await hrmsSolutionRequest.save();
    
    res.status(201).json({
      success: true,
      message: 'HRMS solution request submitted successfully',
      data: {
        id: hrmsSolutionRequest._id,
        submittedAt: hrmsSolutionRequest.submittedAt,
        priority: hrmsSolutionRequest.priority,
        companySize: hrmsSolutionRequest.companySize
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error submitting HRMS solution request:', error);
    
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
      message: 'Failed to submit HRMS solution request',
      timestamp: new Date().toISOString()
    });
  }
};

const getAllHrmsSolutionRequests = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      companySize,
      priority,
      budgetRange,
      sortBy = 'submittedAt', 
      sortOrder = 'desc' 
    } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (companySize) query.companySize = companySize;
    if (priority) query.priority = priority;
    if (budgetRange) query.budgetRange = budgetRange;
    
    const requests = await HrmsSolutionRequest.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const total = await HrmsSolutionRequest.countDocuments(query);
    
    res.status(200).json({
      success: true,
      message: 'HRMS solution requests retrieved successfully',
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
    console.error('Error fetching HRMS solution requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch HRMS solution requests',
      timestamp: new Date().toISOString()
    });
  }
};

const getHrmsSolutionRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID format',
        timestamp: new Date().toISOString()
      });
    }
    
    const request = await HrmsSolutionRequest.findById(id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'HRMS solution request not found',
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'HRMS solution request retrieved successfully',
      data: request,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching HRMS solution request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch HRMS solution request',
      timestamp: new Date().toISOString()
    });
  }
};

const updateHrmsSolutionRequestStatus = async (req, res) => {
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
    
    const request = await HrmsSolutionRequest.findByIdAndUpdate(
      id,
      { 
        status,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'HRMS solution request not found',
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'HRMS solution request status updated successfully',
      data: {
        id: request._id,
        status: request.status,
        updatedAt: request.updatedAt
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating HRMS solution request status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update HRMS solution request status',
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = {
  submitHrmsSolutionRequest,
  getAllHrmsSolutionRequests,
  getHrmsSolutionRequestById,
  updateHrmsSolutionRequestStatus
};
