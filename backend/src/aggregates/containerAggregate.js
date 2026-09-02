const {
  getInitialContainerState,
} = require("./initialState");

function createInitialContainerState() {
  return getInitialContainerState();
}

module.exports = {
  createInitialContainerState,
};