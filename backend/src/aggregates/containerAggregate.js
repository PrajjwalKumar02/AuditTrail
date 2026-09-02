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

  const { type } = event;

  if (!type || typeof type !== "string") {
    throw new TypeError("Event type is required");
  }

  return state;
}

module.exports = {
  createInitialContainerState,
  applyEvent,
};