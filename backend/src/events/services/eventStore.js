const Event = require('../models/Event');
const { generateEventHash } = require('./hash');
const logger = require('../../utils/logger');
const { v4: uuidv4 } = require('uuid');

const appendEvent = async ({ 
  aggregateId, 
  aggregateType = 'Container', 
  eventType, 
  payload, 
  metadata = {} 
}) => {
  try {
    const lastEvent = await Event.findOne({ aggregateId })
      .sort({ version: -1 });
    
    const version = lastEvent ? lastEvent.version + 1 : 1;
    const previousHash = lastEvent ? lastEvent.currentHash : '0'.repeat(64);

    const eventData = {
      aggregateId,
      aggregateType,
      eventType,
      payload,
      version,
      timestamp: new Date(),
      metadata: {
        ...metadata,
        eventId: uuidv4(),
        appendedAt: new Date().toISOString()
      },
      previousHash
    };

    const currentHash = generateEventHash(eventData);
    eventData.currentHash = currentHash;

   
    const event = new Event(eventData);
    await event.save();

    logger.info(`📝 Event appended: ${eventType} v${version} for ${aggregateId}`, {
      eventId: eventData.metadata.eventId,
      hash: currentHash.substring(0, 8) + '...'
    });

    return event;

  } catch (error) {
    logger.error(`❌ Failed to append event: ${error.message}`, {
      aggregateId,
      eventType,
      stack: error.stack
    });
    throw error;
  }
};

const getEventsForAggregate = async (aggregateId, upToVersion = null) => {
  try {
    const query = { aggregateId };
    if (upToVersion) {
      query.version = { $lte: upToVersion };
    }
    
    return await Event.find(query)
      .sort({ version: 1 })
      .lean();
      
  } catch (error) {
    logger.error(`Failed to get events: ${error.message}`);
    return [];
  }
};

const getEventsForAggregatePaginated = async (aggregateId, page = 1, limit = 20) => {
  try {
    const skip = (page - 1) * limit;
    
    const [events, total] = await Promise.all([
      Event.find({ aggregateId })
        .sort({ version: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Event.countDocuments({ aggregateId })
    ]);

    return {
      events,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
    
  } catch (error) {
    logger.error(`Failed to get paginated events: ${error.message}`);
    return { events: [], total: 0, page: 1, limit: 20, totalPages: 0 };
  }
};

const getAllEvents = async (filters = {}) => {
  try {
    const query = {};
    if (filters.aggregateType) query.aggregateType = filters.aggregateType;
    if (filters.eventType) query.eventType = filters.eventType;
    if (filters.fromDate) query.timestamp = { $gte: new Date(filters.fromDate) };
    if (filters.toDate) {
      query.timestamp = { 
        ...query.timestamp, 
        $lte: new Date(filters.toDate) 
      };
    }
    
    return await Event.find(query)
      .sort({ timestamp: -1 })
      .lean();
      
  } catch (error) {
    logger.error(`Failed to get all events: ${error.message}`);
    return [];
  }
};

const getEventById = async (eventId) => {
  try {
    return await Event.findById(eventId).lean();
  } catch (error) {
    logger.error(`Failed to get event by ID: ${error.message}`);
    return null;
  }
};

const getLastEvent = async (aggregateId) => {
  try {
    return await Event.findOne({ aggregateId })
      .sort({ version: -1 })
      .lean();
  } catch (error) {
    logger.error(`Failed to get last event: ${error.message}`);
    return null;
  }
};

const getEventCount = async (aggregateId) => {
  try {
    return await Event.countDocuments({ aggregateId });
  } catch (error) {
    logger.error(`Failed to get event count: ${error.message}`);
    return 0;
  }
};

const getAllAggregates = async () => {
  try {
    return await Event.distinct('aggregateId');
  } catch (error) {
    logger.error(`Failed to get aggregates: ${error.message}`);
    return [];
  }
};


const verifyEventChain = async (aggregateId) => {
  try {
    const events = await getEventsForAggregate(aggregateId);
    
    if (events.length === 0) {
      return { valid: true, message: 'No events to verify' };
    }

    let previousHash = '0'.repeat(64);
    const results = [];

    for (const event of events) {
     
      const computedHash = generateEventHash(event);
      const isValid = computedHash === event.currentHash;
      const chainValid = event.previousHash === previousHash;

      results.push({
        version: event.version,
        eventType: event.eventType,
        isValid,
        chainValid,
        storedHash: event.currentHash.substring(0, 16) + '...',
        computedHash: computedHash.substring(0, 16) + '...'
      });

      if (!isValid || !chainValid) {
        return {
          valid: false,
          message: `Hash verification failed at version ${event.version}`,
          details: results
        };
      }

      previousHash = event.currentHash;
    }

    return {
      valid: true,
      message: 'All events verified successfully',
      details: results,
      totalEvents: events.length
    };

  } catch (error) {
    logger.error(`Failed to verify chain: ${error.message}`);
    return { valid: false, message: error.message };
  }
};

module.exports = {
  appendEvent,
  getEventsForAggregate,
  getEventsForAggregatePaginated,
  getAllEvents,
  getEventById,
  getLastEvent,
  getEventCount,
  getAllAggregates,
  verifyEventChain
};
