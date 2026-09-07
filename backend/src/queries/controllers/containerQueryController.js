const queryService = require('../services/queryService');
const { successResponse, errorResponse } = require('../../utils/response');
const { getPaginationOptions } = require('../../utils/pagination');
const logger = require('../../utils/logger');

const getContainerState = async (req, res, next) => {
  try {
    const { aggregateId } = req.params;
    const userId = req.user?.id;
    
    const state = await queryService.getContainerState(aggregateId, userId);

    if (!state) {
      return errorResponse(res, `Container ${aggregateId} not found`, 404);
    }

    logger.debug(`Container state retrieved: ${aggregateId}`, { userId });

    successResponse(res, { container: state }, 'Container state retrieved');
  } catch (error) {
    next(error);
  }
};

const getAllContainers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, location, search } = req.query;
    const options = getPaginationOptions(page, limit);
    
    const result = await queryService.getAllContainers({ 
      ...options, 
      filters: { status, location, search }
    });

    logger.debug(`Containers retrieved: ${result.total} total`, { 
      page, 
      limit,
      filters: { status, location, search }
    });

    successResponse(res, result, 'Containers retrieved');
  } catch (error) {
    next(error);
  }
};

const getEventHistory = async (req, res, next) => {
  try {
    const { aggregateId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const result = await queryService.getEventHistory(aggregateId, { page, limit });
    
    if (!result || result.events.length === 0) {
      return errorResponse(res, `No events found for container ${aggregateId}`, 404);
    }

    successResponse(res, result, 'Event history retrieved');
  } catch (error) {
    next(error);
  }
};

const getStateAtTimestamp = async (req, res, next) => {
  try {
    const { aggregateId } = req.params;
    const { timestamp } = req.query;

    if (!timestamp) {
      return errorResponse(res, 'Timestamp query parameter required (ISO format)', 400);
    }

    const timestampDate = new Date(timestamp);
    if (isNaN(timestampDate.getTime())) {
      return errorResponse(res, 'Invalid timestamp format. Use ISO format (YYYY-MM-DDTHH:mm:ss)', 400);
    }

    const state = await queryService.getStateAtTimestamp(aggregateId, timestamp);
    
    if (!state) {
      return errorResponse(res, `No data found for container ${aggregateId} at ${timestamp}`, 404);
    }

    logger.info(`Time travel: ${aggregateId} at ${timestamp}`, { 
      userId: req.user?.id,
      replayedEvents: state.replayedEvents 
    });

    successResponse(res, { 
      state,
      metadata: {
        aggregateId,
        timestamp,
        replayedEvents: state.replayedEvents || 0,
        totalEvents: state.totalEvents || 0
      }
    }, 'Historical state retrieved');
  } catch (error) {
    next(error);
  }
};

const verifyIntegrity = async (req, res, next) => {
  try {
    const { aggregateId } = req.params;
    const result = await queryService.verifyIntegrity(aggregateId);
    
    if (!result) {
      return errorResponse(res, `Container ${aggregateId} not found`, 404);
    }

    successResponse(res, result, 'Integrity verification completed');
  } catch (error) {
    next(error);
  }
};

const getContainerStats = async (req, res, next) => {
  try {
    const stats = await queryService.getContainerStats();
    
    successResponse(res, { stats }, 'Statistics retrieved');
  } catch (error) {
    next(error);
  }
};

const getContainerTimeline = async (req, res, next) => {
  try {
    const { aggregateId } = req.params;
    const events = await queryService.getContainerTimeline(aggregateId);
    
    if (!events || events.length === 0) {
      return errorResponse(res, `No timeline data for container ${aggregateId}`, 404);
    }

    successResponse(res, { timeline: events }, 'Timeline retrieved');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContainerState,
  getAllContainers,
  getEventHistory,
  getStateAtTimestamp,
  verifyIntegrity,
  getContainerStats,
  getContainerTimeline
};
