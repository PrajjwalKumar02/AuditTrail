const {
  createInitialContainerState,
  applyEvent,
} = require("./containerAggregate");

const {
  INITIAL_CONTAINER_STATE,
  getInitialContainerState,
} = require("./initialState");

module.exports = {
  createInitialContainerState,
  applyEvent,
  INITIAL_CONTAINER_STATE,
  getInitialContainerState,
};