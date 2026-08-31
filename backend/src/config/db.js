const mongoose = require('mongoose');
const { MONGO_URI, NODE_ENV } = require('./env');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);

    if (NODE_ENV === 'development') {
      mongoose.set('debug', true);
    }

    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

  } catch (error) {
    logger.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (NODE_ENV !== 'test') {
      process.exit(1);
    }
  }
};

module.exports = { connectDB };
