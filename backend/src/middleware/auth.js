const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    let token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Remove Bearer prefix if present
    if (token.startsWith('Bearer ')) {
      token = token.slice(7);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if admin still exists and is active
    const admin = await Admin.findById(decoded.adminId).select('-password');
    
    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token or admin not found.'
      });
    }

    // Check if account is locked
    if (admin.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked.'
      });
    }

    // Add admin info to request
    req.admin = {
      adminId: decoded.adminId,
      email: decoded.email,
      role: decoded.role,
      loginTime: decoded.loginTime
    };

    next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.',
        code: 'TOKEN_EXPIRED'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format.',
        code: 'INVALID_TOKEN'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

module.exports = authMiddleware;
