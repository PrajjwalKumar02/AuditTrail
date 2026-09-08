const ContainerReadModel = require('./models/ContainerReadModel');
const InventoryReadModel = require('./models/InventoryReadModel');
const projectionService = require('./services/projectionService');

/**
 * Projection Module
 * 
 * Central module manager for AuditTrail projection engines, read models, and event handlers.
 */
class ProjectionModule {
  constructor() {
    this.models = {
      ContainerReadModel,
      InventoryReadModel,
    };
    this.service = projectionService;
    this.initialized = false;
  }

  /**
   * Initialize projection module
   */
  async initialize() {
    if (this.initialized) {
      return this;
    }
    
    // Ensure read model indexes are synced
    await ContainerReadModel.init();
    await InventoryReadModel.init();

    this.initialized = true;
    return this;
  }

  /**
   * Process incoming event payload
   * @param {Object} event Domain event
   */
  async processEvent(event) {
    if (!this.initialized) {
      await this.initialize();
    }
    return await this.service.projectEvent(event);
  }
}

module.exports = new ProjectionModule();
