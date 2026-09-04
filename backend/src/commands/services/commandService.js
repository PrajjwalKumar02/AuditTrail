const { appendEvent } = require('../../events/services/eventStore');
const { checkExpectedVersion } = require('../../concurrency/optimisticConcurrency');
const logger = require('../../utils/logger');

const createContainer = async ({ aggregateId, location, userId, userRole }) => {
  await checkExpectedVersion(aggregateId, 0);

  const event = await appendEvent({
    aggregateId,
    aggregateType: 'Container',
    eventType: 'CONTAINER_CREATED',
    payload: { 
      location,
      createdBy: userId,
      createdAt: new Date().toISOString()
    },
    metadata: { 
      userId, 
      command: 'createContainer',
      userRole,
      timestamp: new Date().toISOString()
    }
  });

  return {
    event,
    message: `Container ${aggregateId} created at ${location}`
  };
};

const loadContainer = async ({ aggregateId, ship, location, expectedVersion, userId }) => {
  await checkExpectedVersion(aggregateId, expectedVersion);

  const event = await appendEvent({
    aggregateId,
    aggregateType: 'Container',
    eventType: 'LOADED_ON_SHIP',
    payload: { 
      ship, 
      location,
      loadedBy: userId,
      loadedAt: new Date().toISOString()
    },
    metadata: { 
      userId, 
      command: 'loadContainer',
      expectedVersion,
      timestamp: new Date().toISOString()
    }
  });

  return {
    event,
    message: `Container ${aggregateId} loaded on ${ship}`
  };
};

const moveContainer = async ({ aggregateId, location, expectedVersion, userId }) => {
  await checkExpectedVersion(aggregateId, expectedVersion);

  const event = await appendEvent({
    aggregateId,
    aggregateType: 'Container',
    eventType: 'MOVED',
    payload: { 
      location,
      movedBy: userId,
      movedAt: new Date().toISOString()
    },
    metadata: { 
      userId, 
      command: 'moveContainer',
      expectedVersion,
      timestamp: new Date().toISOString()
    }
  });

  return {
    event,
    message: `Container ${aggregateId} moved to ${location}`
  };
};

const arriveContainer = async ({ aggregateId, location, expectedVersion, userId }) => {
  await checkExpectedVersion(aggregateId, expectedVersion);

  const event = await appendEvent({
    aggregateId,
    aggregateType: 'Container',
    eventType: 'ARRIVED_AT_PORT',
    payload: { 
      location,
      arrivedBy: userId,
      arrivedAt: new Date().toISOString()
    },
    metadata: { 
      userId, 
      command: 'arriveContainer',
      expectedVersion,
      timestamp: new Date().toISOString()
    }
  });

  return {
    event,
    message: `Container ${aggregateId} arrived at ${location}`
  };
};

const temperatureSpike = async ({ aggregateId, temperature, expectedVersion, userId }) => {
  await checkExpectedVersion(aggregateId, expectedVersion);

  const event = await appendEvent({
    aggregateId,
    aggregateType: 'Container',
    eventType: 'TEMPERATURE_SPIKE',
    payload: { 
      temperature,
      recordedBy: userId,
      recordedAt: new Date().toISOString(),
      alert: temperature > 10 ? 'CRITICAL' : temperature > 5 ? 'WARNING' : 'NORMAL'
    },
    metadata: { 
      userId, 
      command: 'temperatureSpike',
      expectedVersion,
      timestamp: new Date().toISOString()
    }
  });

  return {
    event,
    message: `Temperature spike recorded for ${aggregateId}: ${temperature}°C`,
    alertLevel: temperature > 10 ? 'CRITICAL' : temperature > 5 ? 'WARNING' : 'NORMAL'
  };
};

const getCommandHistory = async (aggregateId) => {
  const Event = require('../../events/models/Event');
  const events = await Event.find({ aggregateId })
    .sort({ version: -1 })
    .limit(100);
  
  return events.map(event => ({
    version: event.version,
    eventType: event.eventType,
    payload: event.payload,
    timestamp: event.timestamp,
    metadata: event.metadata
  }));
};

module.exports = {
  createContainer,
  loadContainer,
  moveContainer,
  arriveContainer,
  temperatureSpike,
  getCommandHistory
};
