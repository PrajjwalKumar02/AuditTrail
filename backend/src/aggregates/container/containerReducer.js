const { isValidStatusTransition } = require('./containerState');

const applyEvent = (state, event) => {
  const { eventType, payload, version, timestamp } = event;
  
  const newState = { ...state };
  newState.version = version;
  newState.updatedAt = timestamp;

  switch (eventType) {
    case 'CONTAINER_CREATED':
      newState.id = payload.aggregateId || state.id;
      newState.location = payload.location;
      newState.status = 'CREATED';
      newState.createdAt = timestamp;
      newState.temperature = null;
      newState.ship = null;
      break;
      
    case 'LOADED_ON_SHIP':
      if (!isValidStatusTransition(state.status, 'LOADED')) {
        throw new Error(`Invalid status transition: ${state.status} -> LOADED`);
      }
      newState.ship = payload.ship;
      newState.location = payload.location || state.location;
      newState.status = 'LOADED';
      break;
      
    case 'MOVED':
      if (!isValidStatusTransition(state.status, 'IN_TRANSIT')) {
        throw new Error(`Invalid status transition: ${state.status} -> IN_TRANSIT`);
      }
      newState.location = payload.location;
      newState.status = 'IN_TRANSIT';
      break;
      
    case 'ARRIVED_AT_PORT':
      if (!isValidStatusTransition(state.status, 'ARRIVED')) {
        throw new Error(`Invalid status transition: ${state.status} -> ARRIVED`);
      }
      newState.location = payload.location;
      newState.status = 'ARRIVED';
      break;
      
    case 'TEMPERATURE_SPIKE':
      newState.temperature = payload.temperature;
      if (payload.temperature > 10) {
        newState.status = 'ALERT';
      } else if (payload.temperature > 5 && state.status !== 'ALERT') {
        newState.status = 'WARNING';
      }
      break;
      
    case 'CONTAINER_DAMAGED':
      newState.status = 'DAMAGED';
      newState.metadata.damageReason = payload.reason || 'Unknown';
      break;
      
    case 'CONTAINER_INSPECTED':
      newState.status = 'INSPECTED';
      newState.metadata.inspectedBy = payload.inspectedBy || 'Unknown';
      newState.metadata.inspectionNotes = payload.notes || '';
      break;
      
    case 'CONTAINER_DELAYED':
      newState.status = 'DELAYED';
      newState.metadata.delayReason = payload.reason || 'Unknown';
      newState.metadata.delayDuration = payload.duration || 0;
      break;
      
    default:
      console.warn(`Unknown event type: ${eventType}`);
      break;
  }
  
  newState.metadata = {
    ...newState.metadata,
    totalEvents: (newState.metadata?.totalEvents || 0) + 1,
    lastEventType: eventType,
    lastEventTimestamp: timestamp
  };
  
  return newState;
};

const applyEvents = (state, events) => {
  let currentState = state;
  for (const event of events) {
    currentState = applyEvent(currentState, event);
  }
  return currentState;
};

module.exports = {
  applyEvent,
  applyEvents
};
