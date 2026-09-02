const { verifyToken, extractToken } = require('../services/jwtService');
const { errorResponse } = require('../../utils/response');
const User = require('../models/User');
const logger = require('../../utils/logger');

const authenticate = async (req, res, next) => {
  try {
    const token = extractToken(req.headers.authorization);
    
    if (!token) {
      return errorResponse(res, 'Authentication required. Please provide a valid token', 401);
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return errorResponse(res, 'Invalid or expired token. Please login again', 401);
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return errorResponse(res, 'User not found. Please re-authenticate', 401);
    }

    if (!user.isActive) {
      return errorResponse(res, 'Account is disabled. Please contact support', 403);
    }

    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified
    };

    next();

  } catch (error) {
    logger.error(`Authentication error: ${error.message}`);
    return errorResponse(res, 'Authentication failed', 401);
  }
};

/**
 * Role-based authorization middleware
 * @param {...string} allowedRoles - List of roles allowed to access
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn(`Unauthorized access attempt`, {
        userId: req.user.id,
        email: req.user.email,
        role: req.user.role,
        requiredRoles: allowedRoles,
        path: req.path,
        method: req.method
      });
      return errorResponse(res, 'Insufficient permissions. Access denied', 403);
    }

    next();
  };
};

const hasPermission = (action) => {
  const permissions = {
    admin: ['create', 'read', 'update', 'delete', 'manage_users', 'view_audit'],
    user: ['create', 'read', 'update'],
    auditor: ['read', 'view_audit', 'view_reports']
  };

  return (req, res, next) => {
    const userRole = req.user?.role || 'user';
    const allowedActions = permissions[userRole] || [];
    
    if (!allowedActions.includes(action)) {
      return errorResponse(res, `Insufficient permissions for action: ${action}`, 403);
    }
    
    next();
  };
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = extractToken(req.headers.authorization);
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        const user = await User.findById(decoded.id);
        if (user && user.isActive) {
          req.user = {
            id: user._id,
            email: user.email,
            role: user.role,
            name: user.name
          };
        }
      }
    }
    next();
  } catch (error) {
    next();
  }
};

const isResourceOwner = (userId, resource) => {
  if (!userId || !resource) return false;
  return resource.createdBy === userId;
};

module.exports = {
  authenticate,
  authorize,
  hasPermission,
  optionalAuth,
  isResourceOwner
};
