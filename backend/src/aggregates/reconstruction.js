const {
  getEventsByAggregate,
} = require("../events/eventStore");

const {
  replayEvents,
} = require("./replay");

async function reconstructCurrentState(aggregateId) {
  if (!aggregateId || typeof aggregateId !== "string") {
    throw new TypeError("Aggregate ID is required");
  }

  const events = await getEventsByAggregate(aggregateId);

  return replayEvents(events);
}

module.exports = {
  reconstructCurrentState,
};