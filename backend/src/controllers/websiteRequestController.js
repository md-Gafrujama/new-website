const WebsiteRequest = require('../models/WebsiteRequest');

const submitWebsiteRequest = async (req, res) => {
  try {
    const websiteRequest = new WebsiteRequest(req.body);
    await websiteRequest.save();

    res.status(201).json({
      success: true,
      message: 'Website request submitted successfully',
      data: {
        id: websiteRequest._id,
        submittedAt: websiteRequest.submittedAt
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error submitting website request:', error);

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
      message: 'Failed to submit website request',
      timestamp: new Date().toISOString()
    });
  }
};

const deleteWebsiteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID format',
        timestamp: new Date().toISOString()
      });
    }

    const request = await WebsiteRequest.findByIdAndDelete(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Website request not found',
        timestamp: new Date().toISOString()
      });
    }

    res.status(200).json({
      success: true,
      message: 'Website request deleted successfully',
      data: { id },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error deleting website request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete website request',
      timestamp: new Date().toISOString()
    });
  }
};

const getAllWebsiteRequests = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      websiteType,
      sortBy = 'submittedAt', 
      sortOrder = 'desc' 
    } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (websiteType) query.websiteType = websiteType;
    
    const requests = await WebsiteRequest.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const total = await WebsiteRequest.countDocuments(query);
    
    res.status(200).json({
      success: true,
      message: 'Website requests retrieved successfully',
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
    console.error('Error fetching website requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch website requests',
      timestamp: new Date().toISOString()
    });
  }
};

const getWebsiteRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID format',
        timestamp: new Date().toISOString()
      });
    }

    const request = await WebsiteRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Website request not found',
        timestamp: new Date().toISOString()
      });
    }

    res.status(200).json({
      success: true,
      message: 'Website request retrieved successfully',
      data: request,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching website request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch website request',
      timestamp: new Date().toISOString()
    });
  }
};

const updateWebsiteRequestStatus = async (req, res) => {
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

    const request = await WebsiteRequest.findByIdAndUpdate(
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
        message: 'Website request not found',
        timestamp: new Date().toISOString()
      });
    }

    res.status(200).json({
      success: true,
      message: 'Website request status updated successfully',
      data: {
        id: request._id,
        status: request.status,
        updatedAt: request.updatedAt
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating website request status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update website request status',
      timestamp: new Date().toISOString()
    });
  }
};

// ✅ Fixed export (includes deleteWebsiteRequest)
module.exports = {
  submitWebsiteRequest,
  getAllWebsiteRequests,
  getWebsiteRequestById,
  updateWebsiteRequestStatus,
  deleteWebsiteRequest
};
