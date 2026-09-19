const Event = require('../events/models/Event');
const { broadcastAlert } = require('../websocket/socketServer');
const logger = require('../utils/logger');

const getActiveAlerts = async (filters = {}) => {
  const query = {
    eventType: { $in: ['TEMPERATURE_SPIKE', 'CONTAINER_DAMAGED', 'CONTAINER_DELAYED'] }
  };

  if (filters.aggregateId) {
    query.aggregateId = filters.aggregateId;
  }

  if (filters.fromDate) {
    query.timestamp = { $gte: new Date(filters.fromDate) };
  }

  const events = await Event.find(query)
    .sort({ timestamp: -1 })
    .limit(filters.limit || 50);

  return events
    .map(event => ({
      id: event._id,
      aggregateId: event.aggregateId,
      type: getAlertType(event.eventType),
      severity: getAlertSeverity(event),
      message: getAlertMessage(event),
      timestamp: event.timestamp,
      payload: event.payload
    }))
    .filter(alert => alert.severity !== 'info');
};

const getAlertType = (eventType) => {
  switch (eventType) {
    case 'TEMPERATURE_SPIKE': return 'TEMPERATURE';
    case 'CONTAINER_DAMAGED': return 'DAMAGE';
    case 'CONTAINER_DELAYED': return 'DELAY';
    default: return 'OTHER';
  }
};

const getAlertSeverity = (event) => {
  if (event.eventType === 'TEMPERATURE_SPIKE') {
    const temp = event.payload.temperature;
    if (temp >= 15) return 'critical';
    if (temp >= 10) return 'warning';
    return 'info';
  }
  if (event.eventType === 'CONTAINER_DAMAGED') return 'critical';
  if (event.eventType === 'CONTAINER_DELAYED') return 'warning';
  return 'info';
};

const getAlertMessage = (event) => {
  switch (event.eventType) {
    case 'TEMPERATURE_SPIKE':
      return `Temperature spike: ${event.payload.temperature}°C`;
    case 'CONTAINER_DAMAGED':
      return `Container damaged: ${event.payload.reason || 'Unknown reason'}`;
    case 'CONTAINER_DELAYED':
      return `Container delayed: ${event.payload.reason || 'Unknown reason'}`;
    default:
      return 'Alert';
  }
};

const createAlert = async (alertData) => {
  try {
    broadcastAlert(alertData);
    logger.info(`🚨 Alert created: ${alertData.type} for ${alertData.aggregateId}`);
    return alertData;
  } catch (error) {
    logger.error(`Failed to create alert: ${error.message}`);
    throw error;
  }
};

const getAlertStats = async () => {
  const stats = await Event.aggregate([
    {
      $match: {
        eventType: { $in: ['TEMPERATURE_SPIKE', 'CONTAINER_DAMAGED', 'CONTAINER_DELAYED'] }
      }
    },
    {
      $group: {
        _id: '$eventType',
        count: { $sum: 1 }
      }
    }
  ]);

  return stats.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {});
};

module.exports = {
  getActiveAlerts,
  createAlert,
  getAlertStats,
  getAlertType,
  getAlertSeverity,
  getAlertMessage
};
