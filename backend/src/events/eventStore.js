const Event = require("./Event");
const { generateHash } = require("../utils/crypto");

const appendEvent = async (eventData) => {
  const previousEvent = await Event.findOne({
    aggregateId: eventData.aggregateId,
  }).sort({ version: -1 });

  const previousHash = previousEvent ? previousEvent.hash : null;

  const hashData = {
    aggregateId: eventData.aggregateId,
    aggregateType: eventData.aggregateType,
    eventType: eventData.eventType,
    payload: eventData.payload,
    version: eventData.version,
    timestamp: eventData.timestamp,
    previousHash,
  };

  const hash = generateHash(hashData);

  const event = new Event({
    ...eventData,
    previousHash,
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