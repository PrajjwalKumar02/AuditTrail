const logger = require('../utils/logger');
const { errorResponse } = require('../utils/response');
const { NODE_ENV } = require('../config/env');

const errorHandler = (err, req, res, next) => {
  logger.error(`Error: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id,
    body: req.body,
    query: req.query,
    params: req.params
  });

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
    return errorResponse(res, 'Validation Error', 400, errors);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return errorResponse(res, `${field} already exists`, 409, {
      field,
      value: err.keyValue[field]
    });
  }

  if (err.name === 'CastError') {
    return errorResponse(res, `Invalid ${err.path}: ${err.value}`, 400);
  }

  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid token', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Token expired. Please login again', 401);
  }

  if (err.name === 'OptimisticConcurrencyError') {
    return errorResponse(res, err.message, 409, err.details);
  }

  if (err.statusCode) {
    return errorResponse(res, err.message, err.statusCode, err.details);
  }

  const statusCode = err.status || 500;
  const message = NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message || 'Internal server error';

  const details = NODE_ENV === 'development' ? {
    stack: err.stack,
    name: err.name
  } : undefined;

  return errorResponse(res, message, statusCode, details);
};

module.exports = errorHandler;
