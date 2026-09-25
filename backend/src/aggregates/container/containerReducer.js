const { isValidStatusTransition } = require('./containerState');

const applyEvent = (state, event) => {
  const { eventType, payload = {}, version, timestamp } = event;

  const newState = { ...state };

  // Maintain aggregate identity from the event itself.
  newState.aggregateId =
    event.aggregateId ||
    state.aggregateId ||
    state.id ||
    payload.aggregateId ||
    null;

  newState.id = newState.aggregateId;

  newState.version = version;
  newState.updatedAt = timestamp;
  newState.lastEventType = eventType;
  newState.lastEventAt = timestamp;

  switch (eventType) {
    case 'CONTAINER_CREATED':
      newState.id =
        event.aggregateId ||
        payload.aggregateId ||
        state.id ||
        state.aggregateId ||
        null;

      newState.aggregateId = newState.id;
      newState.location = payload.location;
      newState.status = 'CREATED';
      newState.createdAt = timestamp;
      newState.temperature = null;
      newState.temperatureAlert = false;
      newState.ship = null;
      break;

    case 'LOADED_ON_SHIP':
      if (!isValidStatusTransition(state.status, 'LOADED')) {
        throw new Error(
          `Invalid status transition: ${state.status} -> LOADED`
        );
      }

      newState.ship = payload.ship;
      newState.location = payload.location || state.location;
      newState.status = 'LOADED';
      break;

    case 'MOVED':
      if (!isValidStatusTransition(state.status, 'IN_TRANSIT')) {
        throw new Error(
          `Invalid status transition: ${state.status} -> IN_TRANSIT`
        );
      }

      newState.location = payload.location;
      newState.status = 'IN_TRANSIT';
      break;

    case 'MOVED_TO_PORT':
      // Backward-compatible event used by existing replay tests.
      // It changes the location but keeps the current status.
      newState.location = payload.location;
      break;

    case 'ARRIVED_AT_PORT':
      if (!isValidStatusTransition(state.status, 'ARRIVED')) {
        throw new Error(
          `Invalid status transition: ${state.status} -> ARRIVED`
        );
      }

      newState.location = payload.location;
      newState.status = 'ARRIVED';
      break;

    case 'TEMPERATURE_SPIKE':
      newState.temperature = payload.temperature;

      if (payload.temperature > 10) {
        newState.status = 'ALERT';
        newState.temperatureAlert = true;
      } else if (
        payload.temperature > 5 &&
        state.status !== 'ALERT'
      ) {
        newState.status = 'WARNING';
        newState.temperatureAlert = true;
      } else {
        newState.temperatureAlert = false;
      }

      break;

    case 'CONTAINER_DAMAGED':
      newState.status = 'DAMAGED';

      newState.metadata = {
        ...newState.metadata,
        damageReason: payload.reason || 'Unknown'
      };

      break;

    case 'CONTAINER_INSPECTED':
      newState.status = 'INSPECTED';

      newState.metadata = {
        ...newState.metadata,
        inspectedBy: payload.inspectedBy || 'Unknown',
        inspectionNotes: payload.notes || ''
      };

      break;

    case 'CONTAINER_DELAYED':
      newState.status = 'DELAYED';

      newState.metadata = {
        ...newState.metadata,
        delayReason: payload.reason || 'Unknown',
        delayDuration: payload.duration || 0
      };

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

  newState.events = [
    ...(state.events || []),
    event
  ];

  return newState;
};

module.exports = {
  applyEvent
};