const express = require('express');
const router = express.Router();
const {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount
} = require('../controllers/authController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { validate, schemas } = require('../../middleware/validation');

router.post('/register', validate(schemas.register), register);
router.post('/login', validate(schemas.login), login);
router.post('/refresh-token', refreshToken);

router.use(authenticate); 

router.get('/profile', getProfile);
router.put('/profile', validate(schemas.updateProfile), updateProfile);
router.post('/change-password', validate(schemas.changePassword), changePassword);
router.post('/logout', logout);
router.delete('/account', deleteAccount);

router.get('/users', authorize('admin'), async (req, res, next) => {
  try {
    const User = require('../models/User');
    const users = await User.find().select('-password -refreshToken');
    const { successResponse } = require('../../utils/response');
    successResponse(res, { users, count: users.length }, 'Users retrieved');
  } catch (error) {
    next(error);
  }
});

router.get('/users/:id', authorize('admin'), async (req, res, next) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.params.id).select('-password -refreshToken');
    if (!user) {
      return require('../../utils/response').errorResponse(res, 'User not found', 404);
    }
    const { successResponse } = require('../../utils/response');
    successResponse(res, { user }, 'User retrieved');
  } catch (error) {
    next(error);
  }
});

router.put('/users/:id/status', authorize('admin'), async (req, res, next) => {
  try {
    const User = require('../models/User');
    const { isActive } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return require('../../utils/response').errorResponse(res, 'User not found', 404);
    }
    
    user.isActive = isActive;
    await user.save();
    
    const { successResponse } = require('../../utils/response');
    successResponse(res, { user }, 'User status updated');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
