const Event = require('../events/models/Event');
const logger = require('../utils/logger');

const checkExpectedVersion = async (aggregateId, expectedVersion) => {
  try {
    const lastEvent = await Event.findOne({ aggregateId }).sort({ version: -1 });
    const currentVersion = lastEvent ? lastEvent.version : 0;

    if (currentVersion !== expectedVersion) {
      const error = new Error(
        `Optimistic concurrency conflict: Expected version ${expectedVersion}, but current version is ${currentVersion}`
      );
      error.statusCode = 409;
      error.details = {
        aggregateId,
        expectedVersion,
        currentVersion,
        conflict: true,
        suggestion: `Please use version ${currentVersion} for the next operation`
      };
      error.name = 'OptimisticConcurrencyError';
      
      logger.warn(`OCC conflict for ${aggregateId}`, {
        expectedVersion,
        currentVersion
      });
      
      throw error;
    }

    logger.debug(`OCC check passed for ${aggregateId}`, {
      version: currentVersion
    });

    return currentVersion;

  } catch (error) {
    if (error.name === 'OptimisticConcurrencyError') {
      throw error;
    }
    logger.error(`OCC check failed for ${aggregateId}: ${error.message}`);
    throw new Error(`Failed to check expected version: ${error.message}`);
  }
};

const getCurrentVersion = async (aggregateId) => {
  try {
    const lastEvent = await Event.findOne({ aggregateId }).sort({ version: -1 });
    return lastEvent ? lastEvent.version : 0;
  } catch (error) {
    logger.error(`Failed to get current version for ${aggregateId}: ${error.message}`);
    throw new Error(`Failed to get current version: ${error.message}`);
  }
};

const aggregateExists = async (aggregateId) => {
  try {
    const count = await Event.countDocuments({ aggregateId });
    return count > 0;
  } catch (error) {
    logger.error(`Failed to check if aggregate exists: ${error.message}`);
    return false;
  }
};

const getEventCount = async (aggregateId) => {
  try {
    return await Event.countDocuments({ aggregateId });
  } catch (error) {
    logger.error(`Failed to get event count: ${error.message}`);
    return 0;
  }
};

module.exports = {
  checkExpectedVersion,
  getCurrentVersion,
  aggregateExists,
  getEventCount
};
