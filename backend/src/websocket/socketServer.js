const { Server } = require('socket.io');
const logger = require('../utils/logger');

let io = null;


const initSocketServer = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  io.on('connection', (socket) => {
    logger.info(`🔌 Client connected: ${socket.id}`);

    socket.on('join', (userId) => {
      socket.join(`user-${userId}`);
      logger.debug(`User ${userId} joined room`);
    });

    socket.on('subscribe:container', (aggregateId) => {
      socket.join(`container-${aggregateId}`);
      logger.debug(`Client ${socket.id} subscribed to container-${aggregateId}`);
    });

    socket.on('unsubscribe:container', (aggregateId) => {
      socket.leave(`container-${aggregateId}`);
    });

    socket.on('subscribe:all', () => {
      socket.join('all-containers');
      logger.debug(`Client ${socket.id} subscribed to all containers`);
    });


    socket.on('disconnect', () => {
      logger.info(`🔌 Client disconnected: ${socket.id}`);
    });

   
    socket.on('error', (error) => {
      logger.error(`Socket error for ${socket.id}: ${error.message}`);
    });
  });

  logger.info('🔌 WebSocket server initialized');
  return io;
};

const getIO = () => {
  if (!io) {
    logger.warn('Socket.IO not initialized');
  }
  return io;
};


const emitToContainer = (aggregateId, event, data) => {
  if (io) {
    io.to(`container-${aggregateId}`).emit(event, data);
    io.to('all-containers').emit(event, { aggregateId, ...data });
    logger.debug(`Emitted ${event} to container-${aggregateId}`);
  }
};


const emitToAll = (event, data) => {
  if (io) {
    io.emit(event, data);
    logger.debug(`Emitted ${event} to all clients`);
  }
};


const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(`user-${userId}`).emit(event, data);
    logger.debug(`Emitted ${event} to user-${userId}`);
  }
};


const broadcastEvent = (event) => {
  if (!io) return;
  
  emitToContainer(event.aggregateId, 'event:new', {
    id: event._id,
    aggregateId: event.aggregateId,
    eventType: event.eventType,
    payload: event.payload,
    version: event.version,
    timestamp: event.timestamp
  });
};


const broadcastAlert = (alert) => {
  if (!io) return;
  
  io.to('all-containers').emit('alert:new', alert);
  logger.debug(`Alert broadcasted: ${alert.type}`);
};

module.exports = {
  initSocketServer,
  getIO,
  emitToContainer,
  emitToAll,
  emitToUser,
  broadcastEvent,
  broadcastAlert
};
