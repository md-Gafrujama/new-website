const CrmSolutionRequest = require('../models/CrmSolutionRequest');

const submitCrmSolutionRequest = async (req, res) => {
  try {
    const crmSolutionRequest = new CrmSolutionRequest(req.body);
    await crmSolutionRequest.save();
    
    res.status(201).json({
      success: true,
      message: 'CRM solution request submitted successfully',
      data: {
        id: crmSolutionRequest._id,
        submittedAt: crmSolutionRequest.submittedAt,
        priority: crmSolutionRequest.priority,
        estimatedCost: crmSolutionRequest.getEstimatedCost(),
        isComplexProject: crmSolutionRequest.isComplexProject(),
        isLargeTeam: crmSolutionRequest.isLargeTeam()
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error submitting CRM solution request:', error);
    
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
      message: 'Failed to submit CRM solution request',
      timestamp: new Date().toISOString()
    });
  }
};

const getAllCrmSolutionRequests = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      teamSize,
      priority,
      budgetRange,
      sortBy = 'submittedAt', 
      sortOrder = 'desc' 
    } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (teamSize) query.teamSize = teamSize;
    if (priority) query.priority = priority;
    if (budgetRange) query.budgetRange = budgetRange;
    
    const requests = await CrmSolutionRequest.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const total = await CrmSolutionRequest.countDocuments(query);
    
    res.status(200).json({
      success: true,
      message: 'CRM solution requests retrieved successfully',
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
    console.error('Error fetching CRM solution requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch CRM solution requests',
      timestamp: new Date().toISOString()
    });
  }
};

const getCrmSolutionRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID format',
        timestamp: new Date().toISOString()
      });
    }
    
    const request = await CrmSolutionRequest.findById(id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'CRM solution request not found',
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'CRM solution request retrieved successfully',
      data: {
        ...request.toObject(),
        isComplexProject: request.isComplexProject(),
        isLargeTeam: request.isLargeTeam(),
        requiresCompliance: request.requiresCompliance(),
        estimatedCost: request.getEstimatedCost()
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching CRM solution request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch CRM solution request',
      timestamp: new Date().toISOString()
    });
  }
};

const updateCrmSolutionRequestStatus = async (req, res) => {
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
    
    const request = await CrmSolutionRequest.findByIdAndUpdate(
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
        message: 'CRM solution request not found',
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'CRM solution request status updated successfully',
      data: {
        id: request._id,
        status: request.status,
        updatedAt: request.updatedAt
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating CRM solution request status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update CRM solution request status',
      timestamp: new Date().toISOString()
    });
  }
};

const deleteCrmSolutionRequest = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID format',
        timestamp: new Date().toISOString()
      });
    }

    const deletedRequest = await CrmSolutionRequest.findByIdAndDelete(id);

    if (!deletedRequest) {
      return res.status(404).json({
        success: false,
        message: 'CRM solution request not found',
        timestamp: new Date().toISOString()
      });
    }

    res.status(200).json({
      success: true,
      message: 'CRM solution request deleted successfully',
      data: { id },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error deleting CRM solution request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete CRM solution request',
      timestamp: new Date().toISOString()
    });
  }
};

const getCrmSolutionStatistics = async (req, res) => {
  try {
    const [dashboardStats, teamSizeStats, budgetStats, priorityStats] = await Promise.all([
      CrmSolutionRequest.getDashboardStats(),
      CrmSolutionRequest.getTeamSizeStats(),
      CrmSolutionRequest.getBudgetStats(),
      CrmSolutionRequest.getPriorityStats()
    ]);

    res.status(200).json({
      success: true,
      message: 'CRM solution statistics retrieved successfully',
      data: {
        overview: dashboardStats,
        teamSizes: teamSizeStats,
        budgetRanges: budgetStats,
        priorities: priorityStats
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching CRM solution statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = {
  submitCrmSolutionRequest,
  getAllCrmSolutionRequests,
  getCrmSolutionRequestById,
  updateCrmSolutionRequestStatus,
  deleteCrmSolutionRequest, // ✅ added
  getCrmSolutionStatistics
};
