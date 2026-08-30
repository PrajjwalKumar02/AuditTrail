const app = require('./src/app');
const { connectDB } = require('./src/config/db');
const { PORT, NODE_ENV } = require('./src/config/env');
const { initSocketServer } = require('./src/websocket/socketServer');
const logger = require('./src/utils/logger');

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT} in ${NODE_ENV} mode`);
  connectDB();
});

initSocketServer(server);

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

module.exports = server;
