const INITIAL_CONTAINER_STATE = Object.freeze({
  aggregateId: null,
  status: "CREATED",
  location: null,
  ship: null,
  temperature: null,
  temperatureAlert: false,
  version: 0,
  lastEventType: null,
  lastEventAt: null,
});

function getInitialContainerState() {
  return {
    ...INITIAL_CONTAINER_STATE,
  };
}

module.exports = {
  INITIAL_CONTAINER_STATE,
  getInitialContainerState,
};