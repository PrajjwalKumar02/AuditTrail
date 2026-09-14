const {
  reconstructCurrentState,
} = require("./reconstruction");

async function queryCurrentState(aggregateId) {
  if (!aggregateId || typeof aggregateId !== "string") {
    throw new TypeError("Aggregate ID is required");
  }

  return reconstructCurrentState(aggregateId);
}

module.exports = {
  queryCurrentState,
};