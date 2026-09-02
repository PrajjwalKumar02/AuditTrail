const User = require('../models/User');
const { generateTokens, verifyToken } = require('../services/jwtService');
const { successResponse, errorResponse } = require('../../utils/response');
const logger = require('../../utils/logger');

const register = async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 'User already exists with this email', 409);
    }

    const user = await User.create({
      email,
      password,
      name,
      role: role || 'user'
    });

    const { accessToken, refreshToken } = generateTokens(user);

    user.refreshToken = refreshToken;
    await user.save();

    logger.info(`User registered: ${email}`, { 
      userId: user._id, 
      role: user.role 
    });

    successResponse(res, {
      user,
      tokens: {
        accessToken,
        refreshToken
      }
    }, 'Registration successful', 201);

  } catch (error) {
    if (error.code === 11000) {
      return errorResponse(res, 'Email already exists', 409);
    }
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmailWithPassword(email);
    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }
    if (user.isLocked()) {
      return errorResponse(res, 'Account is locked. Please try again later', 403);
    }
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      await user.incrementLoginAttempts();
      return errorResponse(res, 'Invalid credentials', 401);
    }
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }
    if (!user.isActive) {
      return errorResponse(res, 'Account is disabled. Please contact support', 403);
    }

    const { accessToken, refreshToken } = generateTokens(user);
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    logger.info(`User logged in: ${email}`, { 
      userId: user._id, 
      role: user.role 
    });

    successResponse(res, {
      user,
      tokens: {
        accessToken,
        refreshToken
      }
    }, 'Login successful');

  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return errorResponse(res, 'Refresh token required', 400);
    }

    const decoded = verifyToken(refreshToken);
    if (!decoded) {
      return errorResponse(res, 'Invalid refresh token', 401);
    }

    const user = await User.findOne({ 
      _id: decoded.id, 
      refreshToken 
    });

    if (!user) {
      return errorResponse(res, 'Invalid refresh token', 401);
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    logger.info(`Token refreshed for user: ${user.email}`, { 
      userId: user._id 
    });

    successResponse(res, {
      accessToken,
      refreshToken: newRefreshToken
    }, 'Token refreshed');

  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await User.findOneAndUpdate(
        { refreshToken },
        { refreshToken: null }
      );
    }

    logger.info(`User logged out`, { 
      userId: req.user?.id 
    });

    successResponse(res, null, 'Logout successful');

  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    successResponse(res, { user }, 'Profile retrieved');

  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, preferences } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    if (name) user.name = name;
    if (preferences) {
      user.preferences = {
        ...user.preferences,
        ...preferences
      };
    }

    await user.save();

    logger.info(`Profile updated for user: ${user.email}`, { 
      userId: user._id 
    });

    successResponse(res, { user }, 'Profile updated');

  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      return errorResponse(res, 'Current password is incorrect', 401);
    }

    user.password = newPassword;
    await user.save();

    logger.info(`Password changed for user: ${user.email}`, { 
      userId: user._id 
    });

    successResponse(res, null, 'Password changed successfully');

  } catch (error) {
    next(error);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    user.isActive = false;
    await user.save();

    user.refreshToken = null;
    await user.save();

    logger.info(`Account deleted for user: ${user.email}`, { 
      userId: user._id 
    });

    successResponse(res, null, 'Account deactivated successfully');

  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount
};
