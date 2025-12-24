const Payment = require('../models/Payment');

// Create a new payment
const createPayment = async (req, res) => {
  try {
    const {
      projectId,
      projectType,
      projectName,
      clientName,
      clientEmail,
      amount,
      currency,
      paymentMethod,
      paymentStatus,
      paymentDate,
      dueDate,
      invoiceNumber,
      transactionId,
      notes,
      projectBudget,
      totalProjectValue,
      paidAmount
    } = req.body;

    // Validate required fields
    if (!projectId || !projectType || !projectName || !clientName || !clientEmail || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: projectId, projectType, projectName, clientName, clientEmail, amount',
        timestamp: new Date().toISOString()
      });
    }

    // Calculate remaining amount
    const remainingAmount = totalProjectValue 
      ? Math.max(0, totalProjectValue - ((paidAmount || 0) + amount))
      : null;

    const payment = new Payment({
      projectId,
      projectType,
      projectName,
      clientName,
      clientEmail,
      amount: parseFloat(amount),
      currency: currency || 'USD',
      paymentMethod,
      paymentStatus: paymentStatus || 'pending',
      paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
      dueDate: dueDate ? new Date(dueDate) : null,
      invoiceNumber,
      transactionId,
      notes,
      projectBudget,
      totalProjectValue: totalProjectValue ? parseFloat(totalProjectValue) : null,
      paidAmount: paidAmount ? parseFloat(paidAmount) : 0,
      remainingAmount
    });

    await payment.save();

    res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      data: { payment },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Get all payments
const getAllPayments = async (req, res) => {
  try {
    const {
      projectType,
      paymentStatus,
      clientEmail,
      startDate,
      endDate,
      limit = 100,
      skip = 0
    } = req.query;

    const query = {};

    if (projectType) query.projectType = projectType;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (clientEmail) query.clientEmail = clientEmail.toLowerCase();

    if (startDate || endDate) {
      query.paymentDate = {};
      if (startDate) query.paymentDate.$gte = new Date(startDate);
      if (endDate) query.paymentDate.$lte = new Date(endDate);
    }

    const payments = await Payment.find(query)
      .sort({ paymentDate: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Payment.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'Payments retrieved successfully',
      data: {
        payments,
        total,
        limit: parseInt(limit),
        skip: parseInt(skip)
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Get payment by ID
const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment ID format',
        timestamp: new Date().toISOString()
      });
    }

    const payment = await Payment.findById(id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
        timestamp: new Date().toISOString()
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment retrieved successfully',
      data: { payment },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Update payment
const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment ID format',
        timestamp: new Date().toISOString()
      });
    }

    // Recalculate remaining amount if amount or totalProjectValue is updated
    if (updateData.amount || updateData.totalProjectValue || updateData.paidAmount) {
      const existingPayment = await Payment.findById(id);
      if (existingPayment) {
        const newAmount = updateData.amount || existingPayment.amount;
        const newTotal = updateData.totalProjectValue || existingPayment.totalProjectValue;
        const newPaid = updateData.paidAmount !== undefined ? updateData.paidAmount : existingPayment.paidAmount;
        
        if (newTotal) {
          updateData.remainingAmount = Math.max(0, newTotal - (newPaid + newAmount));
        }
      }
    }

    const payment = await Payment.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
        timestamp: new Date().toISOString()
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment updated successfully',
      data: { payment },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Delete payment
const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment ID format',
        timestamp: new Date().toISOString()
      });
    }

    const payment = await Payment.findByIdAndDelete(id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
        timestamp: new Date().toISOString()
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment deleted successfully',
      data: { id },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete payment',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Get revenue statistics
const getRevenueStats = async (req, res) => {
  try {
    const [overallStats, byProjectType, monthlyRevenue] = await Promise.all([
      Payment.getRevenueStats(),
      Payment.getPaymentsByProjectType(),
      Payment.getMonthlyRevenue()
    ]);

    res.status(200).json({
      success: true,
      message: 'Revenue statistics retrieved successfully',
      data: {
        overall: overallStats,
        byProjectType,
        monthlyRevenue
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching revenue stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch revenue statistics',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Get payments by project
const getPaymentsByProject = async (req, res) => {
  try {
    const { projectId, projectType } = req.query;

    if (!projectId || !projectType) {
      return res.status(400).json({
        success: false,
        message: 'projectId and projectType are required',
        timestamp: new Date().toISOString()
      });
    }

    const payments = await Payment.find({
      projectId,
      projectType
    }).sort({ paymentDate: -1 });

    const totalPaid = payments
      .filter(p => p.paymentStatus === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);

    res.status(200).json({
      success: true,
      message: 'Project payments retrieved successfully',
      data: {
        payments,
        totalPaid,
        count: payments.length
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching project payments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project payments',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  getRevenueStats,
  getPaymentsByProject
};

