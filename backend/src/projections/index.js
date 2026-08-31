/**
 * Projections Module Entry Point (Member 4)
 * 
 * Handles Read Models, Projection Services, Workers, DLQ, and WebSockets.
 */

const ContainerReadModel = require('./models/ContainerReadModel');
const InventoryReadModel = require('./models/InventoryReadModel');

module.exports = {
  ContainerReadModel,
  InventoryReadModel,
};
