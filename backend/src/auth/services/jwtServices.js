const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRE, REFRESH_TOKEN_EXPIRE } = require('../../config/env');
const logger = require('../../utils/logger');

const generateAccessToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
    name: user.name
  };
  
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRE 
  });
};

const generateRefreshToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email
  };
  
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: REFRESH_TOKEN_EXPIRE 
  });
};

const generateTokens = (user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  
  return {
    accessToken,
    refreshToken
  };
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    logger.error(`Token verification failed: ${error.message}`);
    return null;
  }
};

const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

const extractToken = (authHeader) => {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
};

const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded) return true;
    return decoded.exp < Date.now() / 1000;
  } catch (error) {
    return true;
  }
};

const getTokenRemainingTime = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded) return 0;
    const remaining = decoded.exp - Date.now() / 1000;
    return Math.max(0, remaining);
  } catch (error) {
    return 0;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
  verifyToken,
  decodeToken,
  extractToken,
  isTokenExpired,
  getTokenRemainingTime
};
