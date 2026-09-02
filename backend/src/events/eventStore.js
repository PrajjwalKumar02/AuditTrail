const Event = require("./Event");
const { generateHash } = require("../utils/crypto");

const appendEvent = async (eventData) => {
  const hashData = {
    aggregateId: eventData.aggregateId,
    aggregateType: eventData.aggregateType,
    eventType: eventData.eventType,
    payload: eventData.payload,
    version: eventData.version,
    timestamp: eventData.timestamp,
    previousHash: eventData.previousHash,
  };

  const hash = generateHash(hashData);

  const event = new Event({
    ...eventData,
    hash,
  });

  return await event.save();
};

const getEventsByAggregate = async (aggregateId) => {
  return await Event.find({ aggregateId }).sort({ version: 1 });
};

module.exports = {
  appendEvent,
  getEventsByAggregate,
};