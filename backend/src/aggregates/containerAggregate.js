function createInitialContainerState() {
  return {
    aggregateId: null,
    status: "CREATED",
    location: null,
    ship: null,
    temperature: null,
    temperatureAlert: false,
    version: 0,
    lastEventType: null,
    lastEventAt: null,
  };
}

module.exports = {
  createInitialContainerState,
};