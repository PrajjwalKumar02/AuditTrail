const { appendEvent } = require('../events/services/eventStore');
const { broadcastEvent, broadcastAlert } = require('../websocket/socketServer');
const logger = require('../utils/logger');

const recordTemperature = async (aggregateId, temperature, metadata = {}) => {
  try {
    const alertLevel = getAlertLevel(temperature);
    
    const event = await appendEvent({
      aggregateId,
      aggregateType: 'Container',
      eventType: 'TEMPERATURE_SPIKE',
      payload: {
        temperature,
        alert: alertLevel,
        sensorId: metadata.sensorId || 'SENSOR-001',
        recordedAt: new Date().toISOString()
      },
      metadata: {
        ...metadata,
        source: 'temperature_sensor'
      }
    });

    // Broadcast event
    broadcastEvent(event);

    // Broadcast alert if critical
    if (alertLevel === 'CRITICAL' || alertLevel === 'WARNING') {
      broadcastAlert({
        type: 'TEMPERATURE',
        aggregateId,
        temperature,
        level: alertLevel,
        timestamp: event.timestamp,
        message: `Temperature ${temperature}°C is ${alertLevel.toLowerCase()}`
      });
    }

    logger.info(`🌡️ Temperature recorded: ${aggregateId} = ${temperature}°C (${alertLevel})`);
    
    return {
      event,
      alertLevel,
      temperature
    };

  } catch (error) {
    logger.error(`Failed to record temperature: ${error.message}`);
    throw error;
  }
};

const getAlertLevel = (temperature) => {
  if (temperature >= 15) return 'CRITICAL';
  if (temperature >= 10) return 'WARNING';
  if (temperature >= 5) return 'ELEVATED';
  return 'NORMAL';
};

const getTemperatureHistory = async (aggregateId) => {
  const Event = require('../events/models/Event');
  const events = await Event.find({
    aggregateId,
    eventType: 'TEMPERATURE_SPIKE'
  }).sort({ timestamp: 1 });

  return events.map(e => ({
    temperature: e.payload.temperature,
    timestamp: e.timestamp,
    alertLevel: getAlertLevel(e.payload.temperature)
  }));
};


const getTemperatureStats = async (aggregateId) => {
  const history = await getTemperatureHistory(aggregateId);
  
  if (history.length === 0) {
    return null;
  }

  const temps = history.map(h => h.temperature);
  
  return {
    aggregateId,
    count: temps.length,
    min: Math.min(...temps),
    max: Math.max(...temps),
    avg: temps.reduce((a, b) => a + b, 0) / temps.length,
    alerts: history.filter(h => h.alertLevel !== 'NORMAL').length,
    critical: history.filter(h => h.alertLevel === 'CRITICAL').length,
    warning: history.filter(h => h.alertLevel === 'WARNING').length,
    lastReading: history[history.length - 1]
  };
};

module.exports = {
  recordTemperature,
  getAlertLevel,
  getTemperatureHistory,
  getTemperatureStats
};
