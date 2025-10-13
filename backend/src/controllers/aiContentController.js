const AiContentRequest = require('../models/AiContentRequest');

const submitAiContentRequest = async (req, res) => {
  try {
    const aiContentRequest = new AiContentRequest(req.body);
    await aiContentRequest.save();
    
    res.status(201).json({
      success: true,
      message: 'AI content request submitted successfully',
      data: {
        id: aiContentRequest._id,
        submittedAt: aiContentRequest.submittedAt,
        priority: aiContentRequest.priority,
        contentVolume: aiContentRequest.contentVolumePerMonth,
        aiTool: aiContentRequest.aiToolPreference
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error submitting AI content request:', error);
    
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
      message: 'Failed to submit AI content request',
      timestamp: new Date().toISOString()
    });
  }
};

const getAllAiContentRequests = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      contentType,
      aiToolPreference,
      priority,
      sortBy = 'submittedAt', 
      sortOrder = 'desc' 
    } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (contentType) query.contentType = { $in: contentType.split(',') };
    if (aiToolPreference) query.aiToolPreference = aiToolPreference;
    if (priority) query.priority = priority;
    
    const requests = await AiContentRequest.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const total = await AiContentRequest.countDocuments(query);
    
    res.status(200).json({
      success: true,
      message: 'AI content requests retrieved successfully',
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
    console.error('Error fetching AI content requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch AI content requests',
      timestamp: new Date().toISOString()
    });
  }
};

const getAiContentRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID format',
        timestamp: new Date().toISOString()
      });
    }
    
    const request = await AiContentRequest.findById(id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'AI content request not found',
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'AI content request retrieved successfully',
      data: request,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching AI content request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch AI content request',
      timestamp: new Date().toISOString()
    });
  }
};

const updateAiContentRequestStatus = async (req, res) => {
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
    
    const request = await AiContentRequest.findByIdAndUpdate(
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
        message: 'AI content request not found',
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'AI content request status updated successfully',
      data: {
        id: request._id,
        status: request.status,
        updatedAt: request.updatedAt
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating AI content request status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update AI content request status',
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = {
  submitAiContentRequest,
  getAllAiContentRequests,
  getAiContentRequestById,
  updateAiContentRequestStatus
};
