const app = require('./src/app');
const { connectDB } = require('./src/config/db');
const { PORT, NODE_ENV } = require('./src/config/env');
const logger = require('./src/utils/logger');
const { initSocketServer } = require('./src/websocket/socketServer');

process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...', {
    error: err.message,
    stack: err.stack
  });
  process.exit(1);
});

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT} in ${NODE_ENV} mode`);
  logger.info(`📡 API available at http://localhost:${PORT}/api`);
  logger.info(`🔍 Health check at http://localhost:${PORT}/health`);
  
  connectDB();
});

const io = initSocketServer(server);
app.set('io', io); 

process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...', {
    error: err.message,
    stack: err.stack
  });
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('💤 Process terminated!');
    process.exit(0);
  });
});

module.exports = server;
