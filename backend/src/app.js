const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config/env');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');
const rateLimiter = require('./middleware/rateLimiter');
const { successResponse } = require('./utils/response');
const logger = require('./utils/logger');
const authRoutes = require('./auth/routes/authRoutes');
const commandRoutes = require('./commands/routes/commandRoutes');
const queryRoutes = require('./queries/routes/queryRoutes');
const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  hsts: false
}));

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use('/api', rateLimiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (NODE_ENV !== 'test') {
  app.use(requestLogger);
}

app.get('/health', (req, res) => {
  successResponse(res, {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    uptime: process.uptime(),
    memory: process.memoryUsage()
  }, 'Server is healthy');
});

app.get('/api', (req, res) => {
  successResponse(res, {
    name: 'AuditTrail API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      commands: '/api/commands',
      queries: '/api/queries',
      health: '/health'
    },
    documentation: '/docs'
  }, 'Welcome to AuditTrail API');
});

app.use('/api/auth', authRoutes);
app.use('/api/commands', commandRoutes);
app.use('/api/queries', queryRoutes);
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /health',
      'GET /api',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'POST /api/auth/refresh-token',
      'POST /api/auth/logout',
      'GET /api/auth/profile',
      'POST /api/commands/create',
      'POST /api/commands/load',
      'POST /api/commands/move',
      'POST /api/commands/arrive',
      'POST /api/commands/temperature',
      'GET /api/queries/container/:id',
      'GET /api/queries/containers',
      'GET /api/queries/events/:aggregateId',
      'GET /api/queries/state-at/:aggregateId',
      'GET /api/queries/verify/:aggregateId',
      'GET /api/queries/stats'
    ]
  });
});

app.use(errorHandler);

module.exports = app;
