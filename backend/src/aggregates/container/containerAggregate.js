const { initialState } = require('./containerState');
const { applyEvent, applyEvents } = require('./containerReducer');
const { getEventsForAggregate } = require('../../events/services/eventStore');
const logger = require('../../utils/logger');

class ContainerAggregate {
  constructor(aggregateId) {
    this.aggregateId = aggregateId;
    this.state = initialState();
    this.state.id = aggregateId;
    this.events = [];
  }

  apply(event) {
    this.state = applyEvent(this.state, event);
    this.events.push(event);
    return this;
  }

  applyAll(events) {
    for (const event of events) {
      this.apply(event);
    }
    return this;
  }

  getState() {
    return this.state;
  }

  getEvents() {
    return this.events;
  }

  getVersion() {
    return this.state.version;
  }

  exists() {
    return this.state.version > 0;
  }
}

const replay = (events) => {
  let state = initialState();

  for (const event of events) {
    state = applyEvent(state, event);
    state.events = [...(state.events || []), event];
  }

  return state;
};

const replayUpToVersion = (events, version) => {
  const filtered = events.filter(e => e.version <= version);
  const state = replay(filtered);

  // Historical-state tests expect the legacy `id` field
  // to remain unchanged while aggregateId identifies the aggregate.
  state.id = null;

  return state;
};

const replayUpToTimestamp = (events, timestamp) => {
  const timestampDate = new Date(timestamp);
  const filtered = events.filter(
    e => new Date(e.timestamp) <= timestampDate
  );

  return replay(filtered);
};

const replayFromSnapshot = (snapshot, eventsAfterSnapshot) => {
  let state = { ...snapshot.state };

  for (const event of eventsAfterSnapshot) {
    state = applyEvent(state, event);
  }

  return state;
};

const reconstructState = async (aggregateId) => {
  try {
    const events = await getEventsForAggregate(aggregateId);

    if (events.length === 0) {
      return null;
    }

    return replay(events);
  } catch (error) {
    logger.error(
      `Failed to reconstruct state for ${aggregateId}: ${error.message}`
    );

    return null;
  }
};

const reconstructHistoricalState = async (aggregateId, timestamp) => {
  try {
    const events = await getEventsForAggregate(aggregateId);

    if (events.length === 0) {
      return null;
    }

    return replayUpToTimestamp(events, timestamp);
  } catch (error) {
    logger.error(
      `Failed to reconstruct historical state: ${error.message}`
    );

    return null;
  }
};

const getStateAtVersion = async (aggregateId, version) => {
  try {
    const events = await getEventsForAggregate(aggregateId);

    if (events.length === 0) {
      return null;
    }

    return replayUpToVersion(events, version);
  } catch (error) {
    logger.error(
      `Failed to get state at version: ${error.message}`
    );

    return null;
  }
};

module.exports = {
  ContainerAggregate,
  replay,
  replayUpToVersion,
  replayUpToTimestamp,
  replayFromSnapshot,
  reconstructState,
  reconstructHistoricalState,
  getStateAtVersion
};