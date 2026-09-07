const ContainerReadModel = require('../../projections/models/ContainerReadModel');
const Event = require('../../events/models/Event');
const { getEventsForAggregate } = require('../../events/services/eventStore');
const { replay, replayUpToTimestamp } = require('../../aggregates/container/containerAggregate');
const { verifyChain } = require('../../events/services/integrityService');
const logger = require('../../utils/logger');

const getContainerState = async (aggregateId, userId) => {
  const container = await ContainerReadModel.findOne({ aggregateId });
  
  if (!container) {
    return null;
  }

  return {
    id: container.aggregateId,
    location: container.location,
    status: container.status,
    ship: container.ship,
    temperature: container.temperature,
    lastEventVersion: container.lastEventVersion,
    lastEventType: container.lastEventType,
    updatedAt: container.updatedAt,
    createdAt: container.createdAt
  };
};

const getAllContainers = async ({ skip, limit, filters = {} }) => {
  const query = {};
  
  if (filters.status) {
    query.status = filters.status;
  }
  if (filters.location) {
    query.location = { $regex: filters.location, $options: 'i' };
  }
  if (filters.search) {
    query.$or = [
      { aggregateId: { $regex: filters.search, $options: 'i' } },
      { location: { $regex: filters.search, $options: 'i' } },
      { ship: { $regex: filters.search, $options: 'i' } }
    ];
  }

  const [containers, total] = await Promise.all([
    ContainerReadModel.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ updatedAt: -1 }),
    ContainerReadModel.countDocuments(query)
  ]);

  return {
    items: containers,
    total,
    page: Math.floor(skip / limit) + 1,
    limit
  };
};

const getEventHistory = async (aggregateId, { page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;
  
  const [events, total] = await Promise.all([
    Event.find({ aggregateId })
      .sort({ version: -1 })
      .skip(skip)
      .limit(limit),
    Event.countDocuments({ aggregateId })
  ]);

  return {
    events,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
};

const getStateAtTimestamp = async (aggregateId, timestamp) => {
  const events = await getEventsForAggregate(aggregateId);
  if (events.length === 0) return null;

  const timestampDate = new Date(timestamp);
  if (isNaN(timestampDate.getTime())) {
    throw new Error('Invalid timestamp format');
  }

  const state = replayUpToTimestamp(events, timestampDate);

  const filteredEvents = events.filter(e => new Date(e.timestamp) <= timestampDate);
  
  state.replayedEvents = filteredEvents.length;
  state.totalEvents = events.length;
  state.replayedAt = timestampDate.toISOString();

  return state;
};

const verifyIntegrity = async (aggregateId) => {
  const eventCount = await Event.countDocuments({ aggregateId });
  if (eventCount === 0) {
    return null;
  }

  return verifyChain(aggregateId);
};

const getContainerStats = async () => {
  const [total, byStatus, byLocation, byTemperature] = await Promise.all([
    ContainerReadModel.countDocuments(),
    ContainerReadModel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]),
    ContainerReadModel.aggregate([
      { $group: { _id: '$location', count: { $sum: 1 } } }
    ]),
    ContainerReadModel.aggregate([
      { 
        $group: { 
          _id: null, 
          avgTemp: { $avg: '$temperature' },
          maxTemp: { $max: '$temperature' },
          minTemp: { $min: '$temperature' },
          count: { $sum: 1 }
        } 
      }
    ])
  ]);

  const totalEvents = await Event.countDocuments();

  return {
    total,
    byStatus: byStatus.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {}),
    byLocation: byLocation.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {}),
    temperature: byTemperature.length > 0 ? {
      average: byTemperature[0].avgTemp || 0,
      max: byTemperature[0].maxTemp || 0,
      min: byTemperature[0].minTemp || 0,
      monitored: byTemperature[0].count || 0
    } : null,
    totalEvents,
    lastUpdated: new Date().toISOString()
  };
};

const getContainerTimeline = async (aggregateId) => {
  const events = await Event.find({ aggregateId })
    .sort({ version: 1 })
    .select('eventType payload timestamp version metadata');

  if (events.length === 0) {
    return null;
  }

  return events.map(event => ({
    version: event.version,
    eventType: event.eventType,
    payload: event.payload,
    timestamp: event.timestamp,
    metadata: event.metadata
  }));
};

module.exports = {
  getContainerState,
  getAllContainers,
  getEventHistory,
  getStateAtTimestamp,
  verifyIntegrity,
  getContainerStats,
  getContainerTimeline
};
