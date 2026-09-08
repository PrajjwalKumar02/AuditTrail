/**
 * Projections Module Entry Point
 */

const ContainerReadModel = require('./models/ContainerReadModel');
const InventoryReadModel = require('./models/InventoryReadModel');
const projectionService = require('./services/projectionService');
const projectionModule = require('./projectionModule');

module.exports = {
  ContainerReadModel,
  InventoryReadModel,
  projectionService,
  projectionModule,
};
