const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { NODE_ENV } = require('./config/env');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');
const { successResponse } = require('./utils/response');
const commandRoutes = require('./commands/routes/commandRoutes');
const queryRoutes = require('./queries/routes/queryRoutes');
const authRoutes = require('./auth/routes/authRoutes');
const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (NODE_ENV !== 'test') {
  app.use(requestLogger);
}

app.get('/health', (req, res) => {
  successResponse(res, { 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: NODE_ENV 
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/commands', commandRoutes);
app.use('/api/queries', queryRoutes);

app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: `Route ${req.originalUrl} not found` 
  });
});

app.use(errorHandler);

module.exports = app;
