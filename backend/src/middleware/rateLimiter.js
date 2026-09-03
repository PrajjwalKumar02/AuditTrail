const rateLimit = require('express-rate-limit');
const { RATE_LIMIT_WINDOW, RATE_LIMIT_MAX } = require('../config/env');

const rateLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW || 15 * 60 * 1000, // 15 minutes
  max: RATE_LIMIT_MAX || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return req.path === '/health';
  },
  keyGenerator: (req) => {
    return req.user?.id || req.ip;
  }
});

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes
  message: {
    success: false,
    error: 'Too many authentication attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true 
});

const sensitiveRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 operations per hour
  message: {
    success: false,
    error: 'Too many sensitive operations. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = rateLimiter;
module.exports.authRateLimiter = authRateLimiter;
module.exports.sensitiveRateLimiter = sensitiveRateLimiter;
