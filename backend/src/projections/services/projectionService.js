const ContainerReadModel = require('../models/ContainerReadModel');
const InventoryReadModel = require('../models/InventoryReadModel');
const containerProjectionHandler = require('../handlers/containerProjectionHandler');
const locationProjectionHandler = require('../handlers/locationProjectionHandler');
const statusProjectionHandler = require('../handlers/statusProjectionHandler');
const temperatureProjectionHandler = require('../handlers/temperatureProjectionHandler');

/**
 * Projection Service
 * 
 * Applies domain events to update read model states.
 */
class ProjectionService {
  /**
   * Main Projection Dispatcher
   * Routes events to specific projection handlers.
   * 
   * @param {Object} event Raw domain event
   */
  async projectEvent(event) {
    if (!event || !event.eventType) {
      throw new Error('Invalid event payload provided to projection engine');
    }

    switch (event.eventType) {
      case 'CONTAINER_CREATED':
        return await containerProjectionHandler.handleContainerCreated(event);

      case 'CONTAINER_MOVED':
      case 'LOCATION_UPDATED':
      case 'ARRIVED_AT_PORT':
        return await locationProjectionHandler.handleLocationUpdated(event);

      case 'STATUS_UPDATED':
      case 'LOADED_ON_SHIP':
      case 'DELIVERED':
        return await statusProjectionHandler.handleStatusUpdated(event);

      case 'TEMPERATURE_READING':
      case 'TEMPERATURE_SPIKE':
        return await temperatureProjectionHandler.handleTemperatureRecorded(event);

      default:
        return await this.projectMetadata(event);
    }
  }

  /**
   * Project location updates
   */
  async projectLocation(event) {
    return await locationProjectionHandler.handleLocationUpdated(event);
  }

  /**
   * Project status updates
   */
  async projectStatus(event) {
    return await statusProjectionHandler.handleStatusUpdated(event);
  }

  /**
   * Project temperature readings and alerts
   */
  async projectTemperature(event) {
    return await temperatureProjectionHandler.handleTemperatureRecorded(event);
  }

  /**
   * Project metadata and version tracking
   */
  async projectMetadata(event) {
    const { aggregateId, eventType, version, timestamp, _id } = event;

    if (!aggregateId) return null;

    return await ContainerReadModel.findOneAndUpdate(
      { containerId: aggregateId, version: { $lt: version } },
      {
        $set: {
          lastEventId: _id || null,
          lastEventType: eventType,
          lastEventTimestamp: timestamp || new Date(),
          version: version,
        },
      },
      { new: true }
    );
  }

  /**
   * Reset projections state
   */
  async resetProjections() {
    await ContainerReadModel.deleteMany({});
    await InventoryReadModel.deleteMany({});
    return { success: true, message: 'All read model projections reset successfully' };
  }

  /**
   * Fetch projection health metrics
   */
  async getProjectionMetrics() {
    const totalContainers = await ContainerReadModel.countDocuments();
    const totalAlerts = await ContainerReadModel.countDocuments({ temperatureAlert: true });
    const totalInventory = await InventoryReadModel.countDocuments();

    return {
      totalContainers,
      totalAlerts,
      totalInventory,
      status: 'healthy',
      timestamp: new Date(),
    };
  }
}

module.exports = new ProjectionService();
