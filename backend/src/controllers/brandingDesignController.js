const BrandingDesignRequest = require('../models/BrandingDesignRequest');

const submitBrandingDesignRequest = async (req, res) => {
  try {
    const brandingDesignRequest = new BrandingDesignRequest(req.body);
    await brandingDesignRequest.save();
    
    res.status(201).json({
      success: true,
      message: 'Branding & design request submitted successfully',
      data: {
        id: brandingDesignRequest._id,
        submittedAt: brandingDesignRequest.submittedAt,
        urgencyLevel: brandingDesignRequest.urgencyLevel,
        estimatedBudget: brandingDesignRequest.getEstimatedBudget(),
        isHighValue: brandingDesignRequest.isHighValueProject(),
        isUrgent: brandingDesignRequest.isUrgentRequest()
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error submitting branding & design request:', error);
    
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
      message: 'Failed to submit branding & design request',
      timestamp: new Date().toISOString()
    });
  }
};

const getAllBrandingDesignRequests = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      designType,
      budgetRange,
      urgencyLevel,
      sortBy = 'submittedAt', 
      sortOrder = 'desc' 
    } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (designType) query.designType = { $in: designType.split(',') };
    if (budgetRange) query.budgetRange = budgetRange;
    if (urgencyLevel) query.urgencyLevel = urgencyLevel;
    
    const requests = await BrandingDesignRequest.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const total = await BrandingDesignRequest.countDocuments(query);
    
    res.status(200).json({
      success: true,
      message: 'Branding & design requests retrieved successfully',
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
    console.error('Error fetching branding & design requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch branding & design requests',
      timestamp: new Date().toISOString()
    });
  }
};

const getBrandingDesignRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID format',
        timestamp: new Date().toISOString()
      });
    }
    
    const request = await BrandingDesignRequest.findById(id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Branding & design request not found',
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Branding & design request retrieved successfully',
      data: {
        ...request.toObject(),
        estimatedBudget: request.getEstimatedBudget(),
        isHighValueProject: request.isHighValueProject(),
        isUrgentRequest: request.isUrgentRequest(),
        isComplexRequest: request.isComplexRequest()
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching branding & design request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch branding & design request',
      timestamp: new Date().toISOString()
    });
  }
};

const updateBrandingDesignRequestStatus = async (req, res) => {
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
    
    const request = await BrandingDesignRequest.findByIdAndUpdate(
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
        message: 'Branding & design request not found',
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Branding & design request status updated successfully',
      data: {
        id: request._id,
        status: request.status,
        updatedAt: request.updatedAt
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating branding & design request status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update branding & design request status',
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = {
  submitBrandingDesignRequest,
  getAllBrandingDesignRequests,
  getBrandingDesignRequestById,
  updateBrandingDesignRequestStatus
};
