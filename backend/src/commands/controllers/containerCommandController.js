const commandService = require('../services/commandService');
const { successResponse, errorResponse } = require('../../utils/response');
const logger = require('../../utils/logger');

const createContainer = async (req, res, next) => {
  try {
    const { aggregateId, location } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    const result = await commandService.createContainer({
      aggregateId,
      location,
      userId,
      userRole
    });

    logger.info(`Container created: ${aggregateId}`, { 
      userId,
      location 
    });

    successResponse(res, result, 'Container created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const loadContainer = async (req, res, next) => {
  try {
    const { aggregateId, ship, location, expectedVersion } = req.body;
    const userId = req.user.id;

    const result = await commandService.loadContainer({
      aggregateId,
      ship,
      location,
      expectedVersion,
      userId
    });

    logger.info(`Container loaded: ${aggregateId} on ${ship}`, { 
      userId,
      ship,
      location 
    });

    successResponse(res, result, 'Container loaded successfully');
  } catch (error) {
    next(error);
  }
};

const moveContainer = async (req, res, next) => {
  try {
    const { aggregateId, location, expectedVersion } = req.body;
    const userId = req.user.id;

    const result = await commandService.moveContainer({
      aggregateId,
      location,
      expectedVersion,
      userId
    });

    logger.info(`Container moved: ${aggregateId} to ${location}`, { 
      userId,
      location 
    });

    successResponse(res, result, 'Container moved successfully');
  } catch (error) {
    next(error);
  }
};

const arriveContainer = async (req, res, next) => {
  try {
    const { aggregateId, location, expectedVersion } = req.body;
    const userId = req.user.id;

    const result = await commandService.arriveContainer({
      aggregateId,
      location,
      expectedVersion,
      userId
    });

    logger.info(`Container arrived: ${aggregateId} at ${location}`, { 
      userId,
      location 
    });

    successResponse(res, result, 'Container arrived successfully');
  } catch (error) {
    next(error);
  }
};

const temperatureSpike = async (req, res, next) => {
  try {
    const { aggregateId, temperature, expectedVersion } = req.body;
    const userId = req.user.id;

    const result = await commandService.temperatureSpike({
      aggregateId,
      temperature,
      expectedVersion,
      userId
    });

    logger.info(`Temperature spike recorded: ${aggregateId} at ${temperature}°C`, { 
      userId,
      temperature 
    });

    const io = req.app.get('io');
    if (io) {
      io.to(`container-${aggregateId}`).emit('temperature_alert', {
        aggregateId,
        temperature,
        timestamp: new Date().toISOString()
      });
    }

    successResponse(res, result, 'Temperature spike recorded');
  } catch (error) {
    next(error);
  }
};

const getCommandHistory = async (req, res, next) => {
  try {
    const { aggregateId } = req.params;
    const history = await commandService.getCommandHistory(aggregateId);
    
    successResponse(res, { history }, 'Command history retrieved');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createContainer,
  loadContainer,
  moveContainer,
  arriveContainer,
  temperatureSpike,
  getCommandHistory
};
