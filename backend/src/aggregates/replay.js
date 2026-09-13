const {
  createInitialContainerState,
  applyEvent,
} = require("./containerAggregate");

function replayEvents(events) {
  if (!Array.isArray(events)) {
    throw new TypeError("Events must be an array");
  }

  return events.reduce((state, event) => {
    return applyEvent(state, event);
  }, createInitialContainerState());
}

module.exports = {
  replayEvents,
};
