const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  const start = Date.now();
  const originalEnd = res.end;

  let logBody = { ...req.body };
  if (logBody.password) logBody.password = '***';
  if (logBody.currentPassword) logBody.currentPassword = '***';
  if (logBody.newPassword) logBody.newPassword = '***';
  if (logBody.refreshToken) logBody.refreshToken = '***';
  
  logger.debug(`➡️ ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
    userId: req.user?.id,
    query: req.query,
    body: ['POST', 'PUT', 'PATCH'].includes(req.method) ? logBody : undefined
  });

  res.end = function(...args) {
    const duration = Date.now() - start;
    const level = res.statusCode >= 400 ? 'warn' : 'info';
    
    logger[level](`⬅️ ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`, {
      statusCode: res.statusCode,
      duration,
      userId: req.user?.id
    });
    
    originalEnd.apply(res, args);
  };

  next();
};

module.exports = requestLogger;
