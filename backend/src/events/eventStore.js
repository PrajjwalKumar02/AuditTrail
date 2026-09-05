const Event = require("./Event");
const { generateHash, verifyHash } = require("../utils/crypto");

const appendEvent = async (eventData) => {
  const previousEvent = await Event.findOne({
    aggregateId: eventData.aggregateId,
  }).sort({ version: -1 });

  const previousHash = previousEvent ? previousEvent.hash : null;

  const timestamp = eventData.timestamp || new Date();

  const hashData = {
    aggregateId: eventData.aggregateId,
    aggregateType: eventData.aggregateType,
    eventType: eventData.eventType,
    payload: eventData.payload,
    version: eventData.version,
    timestamp,
    previousHash,
  };

  const hash = generateHash(hashData);

  const event = new Event({
    ...eventData,
    timestamp,
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

const verifyEventChain = async (aggregateId) => {
  const events = await getEventsByAggregate(aggregateId);

  let previousHash = null;

  for (const event of events) {
    if (event.previousHash !== previousHash) {
      return false;
    }

    if (!verifyEventIntegrity(event)) {
      return false;
    }

    previousHash = event.hash;
  }

  return true;
};

module.exports = {
  appendEvent,
  getEventsByAggregate,
  verifyEventIntegrity,
  verifyEventChain,
};