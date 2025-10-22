const SaaSProductRequest = require('../models/SaaSProductRequest');

const submitSaaSProductRequest = async (req, res) => {
  try {
    const saasProductRequest = new SaaSProductRequest(req.body);
    await saasProductRequest.save();

    res.status(201).json({
      success: true,
      message: 'SaaS product request submitted successfully',
      data: {
        id: saasProductRequest._id,
        submittedAt: saasProductRequest.submittedAt,
        priority: saasProductRequest.priority
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error submitting SaaS product request:', error);

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
      message: 'Failed to submit SaaS product request',
      timestamp: new Date().toISOString()
    });
  }
};

const getAllSaaSProductRequests = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      preferredTechStack,
      budgetRange,
      priority,
      sortBy = 'submittedAt', 
      sortOrder = 'desc' 
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (preferredTechStack) query.preferredTechStack = preferredTechStack;
    if (budgetRange) query.budgetRange = budgetRange;
    if (priority) query.priority = priority;

    const requests = await SaaSProductRequest.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await SaaSProductRequest.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'SaaS product requests retrieved successfully',
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
    console.error('Error fetching SaaS product requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch SaaS product requests',
      timestamp: new Date().toISOString()
    });
  }
};

const getSaaSProductRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID format',
        timestamp: new Date().toISOString()
      });
    }

    const request = await SaaSProductRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'SaaS product request not found',
        timestamp: new Date().toISOString()
      });
    }

    res.status(200).json({
      success: true,
      message: 'SaaS product request retrieved successfully',
      data: request,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching SaaS product request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch SaaS product request',
      timestamp: new Date().toISOString()
    });
  }
};

const updateSaaSProductRequestStatus = async (req, res) => {
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

    const request = await SaaSProductRequest.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'SaaS product request not found',
        timestamp: new Date().toISOString()
      });
    }

    res.status(200).json({
      success: true,
      message: 'SaaS product request status updated successfully',
      data: {
        id: request._id,
        status: request.status,
        updatedAt: request.updatedAt
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating SaaS product request status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update SaaS product request status',
      timestamp: new Date().toISOString()
    });
  }
};

const deleteSaaSProductRequest = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID format',
        timestamp: new Date().toISOString()
      });
    }

    const deletedRequest = await SaaSProductRequest.findByIdAndDelete(id);

    if (!deletedRequest) {
      return res.status(404).json({
        success: false,
        message: 'SaaS product request not found',
        timestamp: new Date().toISOString()
      });
    }

    res.status(200).json({
      success: true,
      message: 'SaaS product request deleted successfully',
      data: { id },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error deleting SaaS product request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete SaaS product request',
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = {
  submitSaaSProductRequest,
  getAllSaaSProductRequests,
  getSaaSProductRequestById,
  updateSaaSProductRequestStatus,
  deleteSaaSProductRequest
};
