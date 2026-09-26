/**
 * Projections Module Entry Point (Member 4)
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
const { registerWorkerListeners, shutdownWorker } = require('./workers/workerEventListener');
const { DLQModel, dlqHandler } = require('./dlq/dlqHandler');
const retryMechanism = require('./dlq/retryMechanism');
const projectionSocketEvents = require('./events/projectionSocketEvents');
const projectionSystem = require('./projectionSystem');
const projectionValidation = require('./middleware/projectionValidation');
const projectionMetrics = require('./utils/projectionMetrics');

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
  registerWorkerListeners,
  shutdownWorker,
  DLQModel,
  dlqHandler,
  retryMechanism,
  projectionSocketEvents,
  projectionSystem,
  projectionValidation,
  projectionMetrics,
};
