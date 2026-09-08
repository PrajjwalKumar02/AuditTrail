const express = require('express');
const router = express.Router();
const {
  getContainerState,
  getAllContainers,
  getEventHistory,
  getStateAtTimestamp,
  verifyIntegrity,
  getContainerStats,
  getContainerTimeline
} = require('../controllers/containerQueryController');
const { optionalAuth, authenticate, authorize } = require('../../auth/middleware/authMiddleware');

router.get('/containers', optionalAuth, getAllContainers);
router.get('/stats', getContainerStats);
router.get('/container/:aggregateId', authenticate, getContainerState);
router.get('/events/:aggregateId', authenticate, getEventHistory);
router.get('/state-at/:aggregateId', authenticate, getStateAtTimestamp);
router.get('/verify/:aggregateId', authenticate, verifyIntegrity);
router.get('/timeline/:aggregateId', authenticate, getContainerTimeline);

router.get('/admin/stats', authorize('admin'), getContainerStats);

module.exports = router;
