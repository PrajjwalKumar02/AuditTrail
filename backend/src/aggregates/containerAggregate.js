const {
  getInitialContainerState,
} = require("./initialState");

function createInitialContainerState() {
  return getInitialContainerState();
}

function applyEvent(state, event) {
  if (!event || typeof event !== "object") {
    throw new TypeError("Event must be an object");
  }

  const { eventType } = event;

  if (!eventType || typeof eventType !== "string") {
    throw new TypeError("Event type is required");
  }

  switch (eventType) {
    case "CONTAINER_CREATED":
      return applyContainerCreated(state, event);

    case "LOADED_ON_SHIP":
      return applyLoadedOnShip(state, event);

    case "MOVED_TO_PORT":
      return applyMovedToPort(state, event);

    default:
      return state;
  }
}

function applyContainerCreated(state, event) {
  const payload = event.payload || {};

  return {
    ...state,
    aggregateId: event.aggregateId,
    status: "CREATED",
    location: payload.location ?? null,
    version: event.version ?? state.version,
    lastEventType: event.eventType,
    lastEventAt: event.timestamp ?? null,
  };
}

function applyLoadedOnShip(state, event) {
  const payload = event.payload || {};

  return {
    ...state,
    aggregateId: event.aggregateId ?? state.aggregateId,
    status: "LOADED",
    ship: payload.ship ?? null,
    version: event.version ?? state.version,
    lastEventType: event.eventType,
    lastEventAt: event.timestamp ?? null,
  };
}

function applyMovedToPort(state, event) {
  const payload = event.payload || {};

  return {
    ...state,
    aggregateId: event.aggregateId ?? state.aggregateId,
    location: payload.location ?? state.location,
    version: event.version ?? state.version,
    lastEventType: event.eventType,
    lastEventAt: event.timestamp ?? null,
  };
}

module.exports = {
  createInitialContainerState,
  applyEvent,
};