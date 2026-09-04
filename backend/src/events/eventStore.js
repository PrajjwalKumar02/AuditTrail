const Event = require("./Event");
const { generateHash, verifyHash } = require("../utils/crypto");

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

const verifyEventIntegrity = (event) => {
  const hashData = {
    aggregateId: event.aggregateId,
    aggregateType: event.aggregateType,
    eventType: event.eventType,
    payload: event.payload,
    version: event.version,
    timestamp: event.timestamp,
    previousHash: event.previousHash,
  };

  return verifyHash(hashData, event.hash);
};

module.exports = {
  appendEvent,
  getEventsByAggregate,
  verifyEventIntegrity,
};