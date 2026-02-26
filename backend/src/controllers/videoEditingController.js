const VideoEditingRequest = require('../models/VideoEditingRequest');

const submitVideoEditingRequest = async (req, res) => {
  try {
    const request = new VideoEditingRequest(req.body);
    await request.save();
    res.status(201).json({
      success: true,
      message: 'Video editing request submitted successfully',
      data: { id: request._id, submittedAt: request.submittedAt },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error submitting video editing request:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({ path: err.path, msg: err.message }));
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
        timestamp: new Date().toISOString()
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to submit request',
      timestamp: new Date().toISOString()
    });
  }
};

const getAllVideoEditingRequests = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, sortBy = 'submittedAt', sortOrder = 'desc' } = req.query;
    const query = {};
    if (status) query.status = status;
    const requests = await VideoEditingRequest.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const total = await VideoEditingRequest.countDocuments(query);
    res.status(200).json({
      success: true,
      message: 'Video editing requests retrieved successfully',
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
    console.error('Error fetching video editing requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch requests',
      timestamp: new Date().toISOString()
    });
  }
};

const getVideoEditingRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID format',
        timestamp: new Date().toISOString()
      });
    }
    const request = await VideoEditingRequest.findById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
        timestamp: new Date().toISOString()
      });
    }
    res.status(200).json({
      success: true,
      message: 'Request retrieved successfully',
      data: request,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching video editing request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch request',
      timestamp: new Date().toISOString()
    });
  }
};

const updateVideoEditingRequestStatus = async (req, res) => {
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
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', '),
        timestamp: new Date().toISOString()
      });
    }
    const request = await VideoEditingRequest.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
        timestamp: new Date().toISOString()
      });
    }
    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: { id: request._id, status: request.status, updatedAt: request.updatedAt },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating video editing request status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update status',
      timestamp: new Date().toISOString()
    });
  }
};

const deleteVideoEditingRequest = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID format',
        timestamp: new Date().toISOString()
      });
    }
    const request = await VideoEditingRequest.findByIdAndDelete(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
        timestamp: new Date().toISOString()
      });
    }
    res.status(200).json({
      success: true,
      message: 'Request deleted successfully',
      data: { id },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error deleting video editing request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete request',
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = {
  submitVideoEditingRequest,
  getAllVideoEditingRequests,
  getVideoEditingRequestById,
  updateVideoEditingRequestStatus,
  deleteVideoEditingRequest
};
