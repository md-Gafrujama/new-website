// server.js (GAFRU CORRECT)
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const connectDB = require('./config/database');

// Routes
const authRoutes = require('./routes/auth');
const websiteRequestRoutes = require('./routes/websiteRequestRoutes');
const mobileAppRequestRoutes = require('./routes/mobileAppRequestRoutes');
const cloudHostingRoutes = require('./routes/cloudHostingRoutes');
const crmSolutionRoutes = require('./routes/crmSolutionRoutes');
const hrmsSolutionRoutes = require('./routes/hrmsSolutionRoutes');
const aiContentRoutes = require('./routes/aiContentRoutes');
const digitalMarketingRoutes = require('./routes/digitalMarketingRoutes');
const ecommerceProjectRoutes = require('./routes/ecommerceProjectRoutes');
const lmsRoutes = require('./routes/lmsRoutes');
const healthcareRoutes = require('./routes/healthcareRoutes');
const brandingDesignRoutes = require('./routes/brandingDesignRoutes');


const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false // Disable CSP for development
  })
);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',')
      : ['http://localhost:3000'];

    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: process.env.CORS_CREDENTIALS === 'true',
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // PATCH added
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(
  express.json({
    limit: '10mb',
    verify: (req, res, buf) => {
      try {
        JSON.parse(buf);
      } catch (e) {
        res.status(400).json({
          success: false,
          message: 'Invalid JSON format'
        });
        return;
      }
    }
  })
);
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`📝 ${new Date().toISOString()} - ${req.method} ${req.url} - ${req.ip}`);
    next();
  });
}

// Routes (GAFRU CORRECT)
app.use('/api/auth', authRoutes);
app.use('/api/website-requests', websiteRequestRoutes);
app.use('/api/mobile-app-requests', mobileAppRequestRoutes);
app.use('/api/cloud-hosting-requests', cloudHostingRoutes);
app.use('/api/crm-solution-requests', crmSolutionRoutes);
app.use('/api/hrms-solution-requests', hrmsSolutionRoutes);
app.use('/api/ai-content-requests', aiContentRoutes);
app.use('/api/digital-marketing-requests', digitalMarketingRoutes);
app.use('/api/ecommerce-project-requests', ecommerceProjectRoutes);
app.use('/api/lms-requests', lmsRoutes);
app.use('/api/healthcare-requests', healthcareRoutes);
app.use('/api/branding-design-requests', brandingDesignRoutes);


// Root API info
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Website Request API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    services: [
      'Website Design & Development',
      'Mobile Application Development',
      'Cloud, Hosting & Maintenance',
      'CRM Solutions',
      'HRMS Solutions',
      'AI Content Generation',
      'Digital Marketing',
      'E-commerce Project Development',
      'Learning Management Systems (LMS)',
      'Healthcare Solutions'
    ],
    features: [
      'Email-based OTP authentication',
      'Two-factor authentication',
      'JWT token management',
      'Rate limiting protection',
      'Account lockout protection',
      'Website Design Form Processing',
      'Mobile App Request Form Processing',
      'Cloud & Hosting Request Form Processing',
      'CRM Solution Request Form Processing',
      'HRMS Solution Request Form Processing',
      'AI Content Request Form Processing',
      'Digital Marketing Request Form Processing',
      'E-commerce Project Request Form Processing',
      'LMS Request Form Processing',
      'Healthcare Request Form Processing',
      'Branding & Design Request Form Processing'
    ]
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())} seconds`,
    memory: {
      used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
      total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`
    },
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    servicesActive: 1
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      '/api/auth/*',
      '/api/website-requests/*',
      '/api/mobile-app-requests/*',
      '/api/cloud-hosting-requests/*',
      '/api/crm-solution-requests/*',
      '/api/hrms-solution-requests/*',
      '/api/health',
      '/api/ai-content-requests/*',
      '/api/digital-marketing-requests/*',
      '/api/ecommerce-project-requests/*',
      '/api/lms-requests/*',
      '/api/healthcare-requests/*',
      '/api/branding-design-requests/*'
    ]
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('🚨 Global Error Handler:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      details: error
    })
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
const server = app.listen(PORT, HOST, () => {
  console.log(`\n🚀 Website Request API Server Started Successfully!`);
  console.log(`📍 Address: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔄 Started at: ${new Date().toISOString()}`);
  console.log(`✅ Services Active: 1 (Website Requests)`);
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
  server.close(async () => {
    console.log('✅ HTTP server closed');
    try {
      const mongoose = require('mongoose');
      await mongoose.connection.close();
      console.log('✅ Database connection closed');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error closing database connection:', error);
      process.exit(1);
    }
  });
  setTimeout(() => {
    console.error('❌ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});

module.exports = app;
