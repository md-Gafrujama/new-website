const DigitalMarketingRequest = require('../models/DigitalMarketingRequest');

const submitDigitalMarketingRequest = async (req, res) => {
  try {
    const digitalMarketingRequest = new DigitalMarketingRequest(req.body);
    await digitalMarketingRequest.save();
    
    res.status(201).json({
      success: true,
      message: 'Digital marketing request submitted successfully',
      data: {
        id: digitalMarketingRequest._id,
        submittedAt: digitalMarketingRequest.submittedAt,
        urgencyLevel: digitalMarketingRequest.urgencyLevel,
        estimatedBudget: digitalMarketingRequest.getEstimatedBudget(),
        isHighValue: digitalMarketingRequest.isHighValueClient(),
        isUrgent: digitalMarketingRequest.isUrgentRequest()
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error submitting digital marketing request:', error);
    
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
      message: 'Failed to submit digital marketing request',
      timestamp: new Date().toISOString()
    });
  }
};

const getAllDigitalMarketingRequests = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      marketingType,
      monthlyBudget,
      urgencyLevel,
      industryVertical,
      sortBy = 'submittedAt', 
      sortOrder = 'desc' 
    } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (marketingType) query.marketingType = { $in: marketingType.split(',') };
    if (monthlyBudget) query.monthlyBudget = monthlyBudget;
    if (urgencyLevel) query.urgencyLevel = urgencyLevel;
    if (industryVertical) query.industryVertical = industryVertical;
    
    const requests = await DigitalMarketingRequest.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const total = await DigitalMarketingRequest.countDocuments(query);
    
    res.status(200).json({
      success: true,
      message: 'Digital marketing requests retrieved successfully',
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
    console.error('Error fetching digital marketing requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch digital marketing requests',
      timestamp: new Date().toISOString()
    });
  }
};

const getDigitalMarketingRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID format',
        timestamp: new Date().toISOString()
      });
    }
    
    const request = await DigitalMarketingRequest.findById(id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Digital marketing request not found',
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Digital marketing request retrieved successfully',
      data: {
        ...request.toObject(),
        estimatedBudget: request.getEstimatedBudget(),
        isHighValueClient: request.isHighValueClient(),
        isUrgentRequest: request.isUrgentRequest(),
        isComplexCampaign: request.isComplexCampaign()
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching digital marketing request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch digital marketing request',
      timestamp: new Date().toISOString()
    });
  }
};

const updateDigitalMarketingRequestStatus = async (req, res) => {
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
    
    const request = await DigitalMarketingRequest.findByIdAndUpdate(
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
        message: 'Digital marketing request not found',
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Digital marketing request status updated successfully',
      data: {
        id: request._id,
        status: request.status,
        updatedAt: request.updatedAt
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating digital marketing request status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update digital marketing request status',
      timestamp: new Date().toISOString()
    });
  }
};

const getDigitalMarketingStatistics = async (req, res) => {
  try {
    const [dashboardStats, budgetStats, marketingTypeStats, industryStats] = await Promise.all([
      DigitalMarketingRequest.getDashboardStats(),
      DigitalMarketingRequest.getBudgetStats(),
      DigitalMarketingRequest.getMarketingTypeStats(),
      DigitalMarketingRequest.getIndustryStats()
    ]);

    res.status(200).json({
      success: true,
      message: 'Digital marketing statistics retrieved successfully',
      data: {
        overview: dashboardStats,
        budgetDistribution: budgetStats,
        marketingTypes: marketingTypeStats,
        industries: industryStats
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching digital marketing statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      timestamp: new Date().toISOString()
    });
  }
};

const deleteDigitalMarketingRequest = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID format',
        timestamp: new Date().toISOString()
      });
    }

    // Attempt to delete the document
    const deletedRequest = await DigitalMarketingRequest.findByIdAndDelete(id);

    if (!deletedRequest) {
      return res.status(404).json({
        success: false,
        message: 'Digital marketing request not found',
        timestamp: new Date().toISOString()
      });
    }

    res.status(200).json({
      success: true,
      message: 'Digital marketing request deleted successfully',
      data: {
        id: deletedRequest._id,
        deletedAt: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error deleting digital marketing request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete digital marketing request',
      timestamp: new Date().toISOString()
    });
  }
};


module.exports = {
  submitDigitalMarketingRequest,
  getAllDigitalMarketingRequests,
  getDigitalMarketingRequestById,
  updateDigitalMarketingRequestStatus,
  getDigitalMarketingStatistics,
   deleteDigitalMarketingRequest
};
