const {
  createInitialContainerState,
  applyEvent,
} = require("./containerAggregate");

function replayEvents(events) {
  if (!Array.isArray(events)) {
    throw new TypeError("Events must be an array");
  }

  const orderedEvents = [...events].sort((a, b) => {
    return a.version - b.version;
  });

  return orderedEvents.reduce((state, event) => {
    return applyEvent(state, event);
  }, createInitialContainerState());
}

module.exports = {
  replayEvents,
};