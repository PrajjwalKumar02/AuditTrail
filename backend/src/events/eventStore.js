const Event = require("./Event");

const appendEvent = async (eventData) => {
  const event = new Event(eventData);
  return await event.save();
};

const getEventsByAggregate = async (aggregateId) => {
  return await Event.find({ aggregateId }).sort({ version: 1 });
};

module.exports = {
  appendEvent,
  getEventsByAggregate,
};