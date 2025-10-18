const CloudHostingRequest = require('../models/CloudHostingRequest');

const submitCloudHostingRequest = async (req, res) => {
  try {
    const cloudHostingRequest = new CloudHostingRequest(req.body);
    await cloudHostingRequest.save();
    
    res.status(201).json({
      success: true,
      message: 'Cloud hosting request submitted successfully',
      data: {
        id: cloudHostingRequest._id,
        submittedAt: cloudHostingRequest.submittedAt,
        urgencyLevel: cloudHostingRequest.urgencyLevel,
        estimatedMonthlyCost: cloudHostingRequest.getEstimatedMonthlyCost()
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error submitting cloud hosting request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit cloud hosting request',
      timestamp: new Date().toISOString()
    });
  }
};

const getAllCloudHostingRequests = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      platformPreference,
      urgencyLevel,
      serviceType,
      sortBy = 'submittedAt', 
      sortOrder = 'desc' 
    } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (platformPreference) query.platformPreference = platformPreference;
    if (urgencyLevel) query.urgencyLevel = urgencyLevel;
    if (serviceType) query.serviceType = { $in: serviceType.split(',') };
    
    const requests = await CloudHostingRequest.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const total = await CloudHostingRequest.countDocuments(query);
    
    res.status(200).json({
      success: true,
      message: 'Cloud hosting requests retrieved successfully',
      data: {
        requests,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalRequests: total
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching cloud hosting requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cloud hosting requests',
      timestamp: new Date().toISOString()
    });
  }
};

const getCloudHostingRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const request = await CloudHostingRequest.findById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Cloud hosting request not found',
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Cloud hosting request retrieved successfully',
      data: request,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching cloud hosting request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cloud hosting request',
      timestamp: new Date().toISOString()
    });
  }
};

const updateCloudHostingRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const request = await CloudHostingRequest.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Cloud hosting request not found',
        timestamp: new Date().toISOString()
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cloud hosting request status updated successfully',
      data: {
        id: request._id,
        status: request.status,
        updatedAt: request.updatedAt
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating cloud hosting request status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cloud hosting request status',
      timestamp: new Date().toISOString()
    });
  }
};

const getCloudHostingStatistics = async (req, res) => {
  try {
    const [dashboardStats, platformStats, urgencyStats] = await Promise.all([
      CloudHostingRequest.getDashboardStats(),
      CloudHostingRequest.getPlatformStats(),
      CloudHostingRequest.getUrgencyStats()
    ]);

    res.status(200).json({
      success: true,
      message: 'Cloud hosting statistics retrieved successfully',
      data: { overview: dashboardStats, platforms: platformStats, urgencyLevels: urgencyStats },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching cloud hosting statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      timestamp: new Date().toISOString()
    });
  }
};

// 🧹 DELETE Cloud Hosting Request
const deleteCloudHostingRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRequest = await CloudHostingRequest.findByIdAndDelete(id);

    if (!deletedRequest) {
      return res.status(404).json({
        success: false,
        message: 'Cloud hosting request not found',
        timestamp: new Date().toISOString()
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cloud hosting request deleted successfully',
      data: { id: deletedRequest._id },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error deleting cloud hosting request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete cloud hosting request',
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = {
  submitCloudHostingRequest,
  getAllCloudHostingRequests,
  getCloudHostingRequestById,
  updateCloudHostingRequestStatus,
  getCloudHostingStatistics,
  deleteCloudHostingRequest
};
