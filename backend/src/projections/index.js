/**
 * Projections Module Entry Point
 */

const ContainerReadModel = require('./models/ContainerReadModel');
const InventoryReadModel = require('./models/InventoryReadModel');
const projectionService = require('./services/projectionService');

module.exports = {
  ContainerReadModel,
  InventoryReadModel,
  projectionService,
};
