const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Get MongoDB URI from environment variable
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    console.log('🔗 Connecting to MongoDB...');
    console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
    console.log('📊 Database:', mongoURI.split('/').pop()?.split('?')[0] || 'Unknown');
    
    // MongoDB connection options
    const options = {
      maxPoolSize: parseInt(process.env.MONGODB_OPTIONS_MAX_POOL_SIZE) || 10,
      serverSelectionTimeoutMS: parseInt(process.env.MONGODB_OPTIONS_SERVER_SELECTION_TIMEOUT_MS) || 5000,
      socketTimeoutMS: parseInt(process.env.MONGODB_OPTIONS_SOCKET_TIMEOUT_MS) || 45000,
    };

    console.log('⚙️ Connection options:', {
      maxPoolSize: options.maxPoolSize,
      serverSelectionTimeoutMS: options.serverSelectionTimeoutMS,
      socketTimeoutMS: options.socketTimeoutMS
    });

    const conn = await mongoose.connect(mongoURI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔌 Connection State: ${conn.connection.readyState}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('🛑 Received SIGINT, closing MongoDB connection...');
      await mongoose.connection.close();
      console.log('📤 MongoDB connection closed through app termination');
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('🛑 Received SIGTERM, closing MongoDB connection...');
      await mongoose.connection.close();
      console.log('📤 MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('🔍 Connection details:', {
      NODE_ENV: process.env.NODE_ENV,
      MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not set',
      Error: error.message
    });
    
    // In production, exit with error code
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      // In development, just log the error
      console.error('⚠️ Continuing in development mode despite connection failure');
    }
  }
};

module.exports = connectDB;
