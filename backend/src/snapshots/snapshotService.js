const Snapshot = require('./Snapshot');
const { getEventsForAggregate, appendEvent } = require('../events/services/eventStore');
const { replay } = require('../aggregates/container/containerAggregate');
const logger = require('../utils/logger');

const SNAPSHOT_INTERVAL = 10; 


const createSnapshot = async (aggregateId, aggregateType = 'Container') => {
  try {
    const events = await getEventsForAggregate(aggregateId);
    
    if (events.length === 0) {
      return null;
    }

    const lastSnapshot = await Snapshot.findOne({ aggregateId })
      .sort({ version: -1 });

    const lastSnapshotVersion = lastSnapshot ? lastSnapshot.version : 0;
    const eventCountSinceSnapshot = events.length - lastSnapshotVersion;

    if (eventCountSinceSnapshot < SNAPSHOT_INTERVAL) {
      logger.debug(`Skipping snapshot for ${aggregateId}, only ${eventCountSinceSnapshot} events since last`);
      return lastSnapshot;
    }

   
    const state = replay(events);

   
    const snapshot = new Snapshot({
      aggregateId,
      aggregateType,
      state,
      version: state.version,
      eventCount: events.length,
      lastEventId: events[events.length - 1]._id
    });

    await snapshot.save();

    logger.info(`📸 Snapshot created for ${aggregateId} at version ${state.version}`, {
      eventCount: events.length
    });

    return snapshot;

  } catch (error) {
    logger.error(`Failed to create snapshot: ${error.message}`);
    return null;
  }
};


const getLatestSnapshot = async (aggregateId) => {
  try {
    return await Snapshot.findOne({ aggregateId })
      .sort({ version: -1 })
      .lean();
  } catch (error) {
    logger.error(`Failed to get snapshot: ${error.message}`);
    return null;
  }
};

const rebuildFromSnapshot = async (aggregateId) => {
  try {
    const snapshot = await getLatestSnapshot(aggregateId);
    
    if (!snapshot) {
    
      const events = await getEventsForAggregate(aggregateId);
      return replay(events);
    }

  
    const eventsAfterSnapshot = await getEventsForAggregate(aggregateId, null);
    const filteredEvents = eventsAfterSnapshot.filter(e => e.version > snapshot.version);

    
    let state = { ...snapshot.state };
    
    for (const event of filteredEvents) {
      state = require('../aggregates/container/containerReducer').applyEvent(state, event);
    }

    logger.debug(`Rebuilt ${aggregateId} from snapshot v${snapshot.version} + ${filteredEvents.length} events`);
    
    return state;

  } catch (error) {
    logger.error(`Failed to rebuild from snapshot: ${error.message}`);
    return null;
  }
};


const cleanupSnapshots = async (aggregateId, keepCount = 3) => {
  try {
    const snapshots = await Snapshot.find({ aggregateId })
      .sort({ version: -1 })
      .skip(keepCount);

    if (snapshots.length > 0) {
      const ids = snapshots.map(s => s._id);
      await Snapshot.deleteMany({ _id: { $in: ids } });
      logger.info(`Cleaned up ${snapshots.length} old snapshots for ${aggregateId}`);
    }

    return snapshots.length;
  } catch (error) {
    logger.error(`Failed to cleanup snapshots: ${error.message}`);
    return 0;
  }
};

module.exports = {
  createSnapshot,
  getLatestSnapshot,
  rebuildFromSnapshot,
  cleanupSnapshots,
  SNAPSHOT_INTERVAL
};
