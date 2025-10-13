const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    await createDefaultAdmin();
    
    return conn;
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

const createDefaultAdmin = async () => {
  try {
    const Admin = require('../models/Admin');
    const bcrypt = require('bcryptjs');

    const existingAdmin = await Admin.findOne({ 
      email: process.env.ADMIN_EMAIL 
    });
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || 'Admin@123', 
        parseInt(process.env.BCRYPT_ROUNDS) || 12
      );
      
      const defaultAdmin = new Admin({
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        createdAt: new Date()
      });

      await defaultAdmin.save();
      console.log('👤 Default admin created successfully');
      console.log(`📧 Email: ${process.env.ADMIN_EMAIL}`);
    } else {
      console.log('👤 Default admin already exists');
    }
  } catch (error) {
    console.error('❌ Error creating default admin:', error.message);
  }
};

mongoose.connection.on('connected', () => {
  console.log('📊 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('📊 Mongoose disconnected from MongoDB');
});

process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('📊 Mongoose connection closed through app termination');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error closing mongoose connection:', error);
    process.exit(1);
  }
});

module.exports = connectDB;
