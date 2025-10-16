const MobileAppRequest = require('../models/MobileAppRequest');

const submitMobileAppRequest = async (req, res) => {
  try {
    const mobileAppRequest = new MobileAppRequest(req.body);
    await mobileAppRequest.save();
    
    res.status(201).json({
      success: true,
      message: 'Mobile app request submitted successfully',
      data: {
        id: mobileAppRequest._id,
        submittedAt: mobileAppRequest.submittedAt
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error submitting mobile app request:', error);
    
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
      message: 'Failed to submit mobile app request',
      timestamp: new Date().toISOString()
    });
  }
};

const getAllMobileAppRequests = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      appType,
      preferredFramework,
      sortBy = 'submittedAt', 
      sortOrder = 'desc' 
    } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (appType) query.appType = { $in: appType.split(',') };
    if (preferredFramework) query.preferredFramework = preferredFramework;
    
    const requests = await MobileAppRequest.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const total = await MobileAppRequest.countDocuments(query);
    
    res.status(200).json({
      success: true,
      message: 'Mobile app requests retrieved successfully',
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
    console.error('Error fetching mobile app requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mobile app requests',
      timestamp: new Date().toISOString()
    });
  }
};

const getMobileAppRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID format',
        timestamp: new Date().toISOString()
      });
    }
    
    const request = await MobileAppRequest.findById(id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Mobile app request not found',
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Mobile app request retrieved successfully',
      data: request,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching mobile app request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mobile app request',
      timestamp: new Date().toISOString()
    });
  }
};

const updateMobileAppRequestStatus = async (req, res) => {
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
    
    const request = await MobileAppRequest.findByIdAndUpdate(
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
        message: 'Mobile app request not found',
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Mobile app request status updated successfully',
      data: {
        id: request._id,
        status: request.status,
        updatedAt: request.updatedAt
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating mobile app request status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update mobile app request status',
      timestamp: new Date().toISOString()
    });
  }
};
const deleteMobileAppRequest = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID format',
        timestamp: new Date().toISOString()
      });
    }

    const request = await MobileAppRequest.findByIdAndDelete(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Mobile app request not found',
        timestamp: new Date().toISOString()
      });
    }

    res.status(200).json({
      success: true,
      message: 'Mobile app request deleted successfully',
      data: { id },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error deleting mobile app request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete mobile app request',
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = {
  submitMobileAppRequest,
  getAllMobileAppRequests,
  getMobileAppRequestById,
  updateMobileAppRequestStatus,
   deleteMobileAppRequest
};
