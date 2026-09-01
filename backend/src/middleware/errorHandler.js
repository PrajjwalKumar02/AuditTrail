const logger = require('../utils/logger');
const { errorResponse } = require('../utils/response');
const { NODE_ENV } = require('../config/env');

const errorHandler = (err, req, res, next) => {

  logger.error(`Error: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id
  });

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return errorResponse(res, 'Validation Error', 400, errors);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return errorResponse(res, `${field} already exists`, 409);
  }

  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid token', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Token expired', 401);
  }

  if (err.statusCode) {
    return errorResponse(res, err.message, err.statusCode, err.details);
  }

  const statusCode = err.status || 500;
  const message = NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message || 'Internal server error';

  return errorResponse(res, message, statusCode, NODE_ENV === 'development' ? err.stack : undefined);
};

module.exports = errorHandler;
