const express = require('express');
const router = express.Router();
const {
  createContainer,
  loadContainer,
  moveContainer,
  arriveContainer,
  temperatureSpike,
  getCommandHistory
} = require('../controllers/containerCommandController');
const { authenticate, authorize } = require('../../auth/middleware/authMiddleware');
const { validate, schemas } = require('../../middleware/validation');

router.use(authenticate);

router.post('/create', 
  authorize('admin', 'user'), 
  validate(schemas.createContainer), 
  createContainer
);

router.post('/load', 
  authorize('admin', 'user'), 
  validate(schemas.loadContainer), 
  loadContainer
);

router.post('/move', 
  authorize('admin', 'user'), 
  validate(schemas.moveContainer), 
  moveContainer
);

router.post('/arrive', 
  authorize('admin', 'user'), 
  validate(schemas.arriveContainer), 
  arriveContainer
);

router.post('/temperature', 
  authorize('admin', 'user', 'auditor'), 
  validate(schemas.temperatureSpike), 
  temperatureSpike
);

router.get('/history/:aggregateId', 
  authorize('admin', 'user', 'auditor'), 
  getCommandHistory
);

module.exports = router;
