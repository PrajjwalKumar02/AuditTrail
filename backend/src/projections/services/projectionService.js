const ContainerReadModel = require('../models/ContainerReadModel');
const { getEventsForAggregate } = require('../../events/services/eventStore');
const { replay } = require('../../aggregates/container/containerAggregate');
const logger = require('../../utils/logger');

const projectContainer = async (aggregateId) => {
  try {
    const events = await getEventsForAggregate(aggregateId);
    
    if (events.length === 0) {
      return null;
    }

    const state = replay(events);

    const temperatureHistory = events
      .filter(e => e.eventType === 'TEMPERATURE_SPIKE')
      .map(e => ({
        value: e.payload.temperature,
        timestamp: e.timestamp,
        alert: e.payload.temperature > 10
      }));

    const alerts = events
      .filter(e => 
        e.eventType === 'TEMPERATURE_SPIKE' && e.payload.temperature > 5 ||
        e.eventType === 'CONTAINER_DAMAGED' ||
        e.eventType === 'CONTAINER_DELAYED'
      )
      .map(e => ({
        type: e.eventType === 'TEMPERATURE_SPIKE' ? 'TEMPERATURE' : 
              e.eventType === 'CONTAINER_DAMAGED' ? 'DAMAGE' : 'DELAY',
        message: getAlertMessage(e),
        severity: getSeverity(e),
        timestamp: e.timestamp,
        acknowledged: false
      }));

    const timeline = events.map(e => ({
      version: e.version,
      eventType: e.eventType,
      timestamp: e.timestamp,
      summary: getEventSummary(e)
    }));

    const readModel = await ContainerReadModel.findOneAndUpdate(
      { aggregateId },
      {
        aggregateId,
        location: state.location,
        status: state.status,
        ship: state.ship,
        temperature: state.temperature,
        temperatureHistory,
        lastEventVersion: state.version,
        lastEventType: events[events.length - 1].eventType,
        lastEventTimestamp: events[events.length - 1].timestamp,
        totalEvents: events.length,
        alerts,
        timeline
      },
      { upsert: true, new: true }
    );

    logger.debug(`Projected container ${aggregateId} at version ${state.version}`);
    return readModel;

  } catch (error) {
    logger.error(`Failed to project container ${aggregateId}: ${error.message}`);
    throw error;
  }
};

const getAlertMessage = (event) => {
  switch (event.eventType) {
    case 'TEMPERATURE_SPIKE':
      return `Temperature: ${event.payload.temperature}°C`;
    case 'CONTAINER_DAMAGED':
      return `Container damaged: ${event.payload.reason || 'Unknown'}`;
    case 'CONTAINER_DELAYED':
      return `Container delayed: ${event.payload.reason || 'Unknown'}`;
    default:
      return 'Alert';
  }
};

const getSeverity = (event) => {
  if (event.eventType === 'TEMPERATURE_SPIKE') {
    return event.payload.temperature > 10 ? 'critical' : 'warning';
  }
  if (event.eventType === 'CONTAINER_DAMAGED') return 'critical';
  if (event.eventType === 'CONTAINER_DELAYED') return 'warning';
  return 'info';
};

const getEventSummary = (event) => {
  switch (event.eventType) {
    case 'CONTAINER_CREATED':
      return `Created at ${event.payload.location}`;
    case 'LOADED_ON_SHIP':
      return `Loaded on ${event.payload.ship}`;
    case 'MOVED':
      return `Moved to ${event.payload.location}`;
    case 'ARRIVED_AT_PORT':
      return `Arrived at ${event.payload.location}`;
    case 'TEMPERATURE_SPIKE':
      return `Temperature: ${event.payload.temperature}°C`;
    default:
      return event.eventType;
  }
};

const rebuildAllProjections = async () => {
  try {
    const Event = require('../../events/models/Event');
    const aggregates = await Event.distinct('aggregateId');
    
    logger.info(`Rebuilding ${aggregates.length} projections...`);
    
    let success = 0;
    let failed = 0;

    for (const id of aggregates) {
      try {
        await projectContainer(id);
        success++;
      } catch (error) {
        failed++;
        logger.error(`Failed to project ${id}: ${error.message}`);
      }
    }

    logger.info(`Projections rebuilt: ${success} success, ${failed} failed`);
    
    return { total: aggregates.length, success, failed };

  } catch (error) {
    logger.error(`Failed to rebuild projections: ${error.message}`);
    throw error;
  }
};

const deleteProjection = async (aggregateId) => {
  try {
    await ContainerReadModel.deleteOne({ aggregateId });
    logger.info(`Projection deleted for ${aggregateId}`);
    return true;
  } catch (error) {
    logger.error(`Failed to delete projection: ${error.message}`);
    return false;
  }
};

const resetProjections = async () => {
  try {
    await ContainerReadModel.deleteMany({});
    logger.info('All projections reset successfully');
    return { success: true, message: 'All read model projections reset successfully' };
  } catch (error) {
    logger.error(`Failed to reset projections: ${error.message}`);
    throw error;
  }
};

const getProjectionMetrics = async () => {
  const totalContainers = await ContainerReadModel.countDocuments();
  const totalAlerts = await ContainerReadModel.countDocuments({ 'alerts.0': { $exists: true } });

  return {
    totalContainers,
    totalAlerts,
    status: 'healthy',
    timestamp: new Date(),
  };
};

module.exports = {
  projectContainer,
  rebuildAllProjections,
  deleteProjection,
  resetProjections,
  getProjectionMetrics
};
