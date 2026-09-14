const {
  getEventsByAggregate,
} = require("../events/eventStore");

async function getAggregateEventHistory(aggregateId) {
  if (!aggregateId || typeof aggregateId !== "string") {
    throw new TypeError("Aggregate ID is required");
  }

  const events = await getEventsByAggregate(aggregateId);

  return events.map((event) => ({
    aggregateId: event.aggregateId,
    aggregateType: event.aggregateType,
    eventType: event.eventType,
    payload: event.payload,
    version: event.version,
    timestamp: event.timestamp,
    previousHash: event.previousHash,
    hash: event.hash,
  }));
}

module.exports = {
  getAggregateEventHistory,
};