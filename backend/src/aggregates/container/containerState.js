const initialState = () => ({
  id: null,
  location: null,
  status: 'CREATED',
  ship: null,
  temperature: null,
  version: 0,
  events: [],
  createdAt: null,
  updatedAt: null,
  metadata: {
    totalEvents: 0,
    lastEventType: null,
    lastEventTimestamp: null
  }
});

const VALID_STATUS_TRANSITIONS = {
  CREATED: ['LOADED', 'ARRIVED', 'IN_TRANSIT'],
  LOADED: ['IN_TRANSIT', 'ARRIVED'],
  IN_TRANSIT: ['ARRIVED', 'DELAYED', 'DAMAGED'],
  ARRIVED: ['INSPECTED', 'DELAYED'],
  DELAYED: ['IN_TRANSIT', 'ARRIVED'],
  DAMAGED: ['INSPECTED'],
  INSPECTED: ['ARRIVED']
};

const isValidStatusTransition = (currentStatus, newStatus) => {
  const allowed = VALID_STATUS_TRANSITIONS[currentStatus] || [];
  return allowed.includes(newStatus) || currentStatus === newStatus;
};

const getNextVersion = (state) => {
  return state.version + 1;
};

const updateMetadata = (state, event) => {
  state.metadata.totalEvents += 1;
  state.metadata.lastEventType = event.eventType;
  state.metadata.lastEventTimestamp = event.timestamp;
  return state;
};

module.exports = {
  initialState,
  VALID_STATUS_TRANSITIONS,
  isValidStatusTransition,
  getNextVersion,
  updateMetadata
};
