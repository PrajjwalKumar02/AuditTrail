const mongoose = require('mongoose');
const { MONGO_URI, NODE_ENV } = require('./env');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };

    const conn = await mongoose.connect(MONGO_URI, options);

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}:${conn.connection.port}`);
    logger.info(`📊 Database: ${conn.connection.name}`);

    if (NODE_ENV === 'development') {
      mongoose.set('debug', (collectionName, method, query, doc) => {
        logger.debug(`Mongoose: ${collectionName}.${method}`, { query, doc });
      });
    }

    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('🔄 MongoDB reconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    logger.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (NODE_ENV !== 'test') {
      process.exit(1);
    }
  }
};

module.exports = { connectDB };
