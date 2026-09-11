const ContainerReadModel = require('../models/ContainerReadModel');
const InventoryReadModel = require('../models/InventoryReadModel');
const containerProjectionHandler = require('../handlers/containerProjectionHandler');

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
      case 'ARRIVED_AT_PORT':
        return await this.projectLocation(event);

      case 'STATUS_UPDATED':
      case 'LOADED_ON_SHIP':
      case 'DELIVERED':
        return await this.projectStatus(event);

      case 'TEMPERATURE_READING':
      case 'TEMPERATURE_SPIKE':
        return await this.projectTemperature(event);

      default:
        return await this.projectMetadata(event);
    }
  }

  /**
   * Project location updates
   */
  async projectLocation(event) {
    const { aggregateId, eventType, payload, version, timestamp, _id } = event;

    if (!aggregateId) {
      throw new Error('Event missing aggregateId');
    }

    const location = payload.location || payload.currentLocation || payload.destination || 'In Transit';

    return await ContainerReadModel.findOneAndUpdate(
      { containerId: aggregateId, version: { $lt: version } },
      {
        $set: {
          containerId: aggregateId,
          currentLocation: location,
          lastEventId: _id || null,
          lastEventType: eventType,
          lastEventTimestamp: timestamp || new Date(),
          version: version,
        },
      },
      { upsert: true, new: true }
    );
  }

  /**
   * Project status updates
   */
  async projectStatus(event) {
    const { aggregateId, eventType, payload, version, timestamp, _id } = event;

    if (!aggregateId) {
      throw new Error('Event missing aggregateId');
    }

    const status = payload.status || (eventType === 'DELIVERED' ? 'DELIVERED' : 'IN_TRANSIT');

    return await ContainerReadModel.findOneAndUpdate(
      { containerId: aggregateId, version: { $lt: version } },
      {
        $set: {
          containerId: aggregateId,
          status: status,
          lastEventId: _id || null,
          lastEventType: eventType,
          lastEventTimestamp: timestamp || new Date(),
          version: version,
        },
      },
      { upsert: true, new: true }
    );
  }

  /**
   * Project temperature readings and alerts
   */
  async projectTemperature(event) {
    const { aggregateId, eventType, payload, version, timestamp, _id } = event;

    if (!aggregateId) {
      throw new Error('Event missing aggregateId');
    }

    const temp = payload.temperature !== undefined ? payload.temperature : payload.temp;
    const isAlert = temp > 10.0 || eventType === 'TEMPERATURE_SPIKE';

    const updateFields = {
      containerId: aggregateId,
      currentTemperature: temp,
      temperatureAlert: isAlert,
      lastEventId: _id || null,
      lastEventType: eventType,
      lastEventTimestamp: timestamp || new Date(),
      version: version,
    };

    if (isAlert) {
      updateFields.status = 'ALERT_SPIKE';
    }

    return await ContainerReadModel.findOneAndUpdate(
      { containerId: aggregateId, version: { $lt: version } },
      { $set: updateFields },
      { upsert: true, new: true }
    );
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
