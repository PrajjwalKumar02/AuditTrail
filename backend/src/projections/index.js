/**
 * Projections Module Entry Point
 */

const ContainerReadModel = require('./models/ContainerReadModel');
const InventoryReadModel = require('./models/InventoryReadModel');
const projectionService = require('./services/projectionService');
const projectionModule = require('./projectionModule');
const containerProjectionHandler = require('./handlers/containerProjectionHandler');
const locationProjectionHandler = require('./handlers/locationProjectionHandler');
const statusProjectionHandler = require('./handlers/statusProjectionHandler');
const temperatureProjectionHandler = require('./handlers/temperatureProjectionHandler');
const versionProjectionHandler = require('./handlers/versionProjectionHandler');
const projectionQueryController = require('./controllers/projectionQueryController');
const projectionQueryRoutes = require('./routes/projectionQueryRoutes');
const projectionWorker = require('./workers/projectionWorker');

module.exports = {
  ContainerReadModel,
  InventoryReadModel,
  projectionService,
  projectionModule,
  containerProjectionHandler,
  locationProjectionHandler,
  statusProjectionHandler,
  temperatureProjectionHandler,
  versionProjectionHandler,
  projectionQueryController,
  projectionQueryRoutes,
  projectionWorker,
};
