/**
 * Projections Module Entry Point
 */

const ContainerReadModel = require('./models/ContainerReadModel');
const InventoryReadModel = require('./models/InventoryReadModel');
const projectionService = require('./services/projectionService');
const projectionModule = require('./projectionModule');
const containerProjectionHandler = require('./handlers/containerProjectionHandler');

module.exports = {
  ContainerReadModel,
  InventoryReadModel,
  projectionService,
  projectionModule,
  containerProjectionHandler,
};
