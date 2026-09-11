const ContainerReadModel = require('../models/ContainerReadModel');

/**
 * Container Projection Handler (Member 4 - Item #11)
 * 
 * Handles full container lifecycle creation and state projection.
 */
class ContainerProjectionHandler {
  /**
   * Project CONTAINER_CREATED event into ContainerReadModel
   * 
   * @param {Object} event Domain event
   */
  async handleContainerCreated(event) {
    const { aggregateId, payload, version, timestamp, _id } = event;

    if (!aggregateId) {
      throw new Error('Container creation event missing aggregateId');
    }

    const containerData = {
      containerId: aggregateId,
      currentLocation: payload.location || payload.currentLocation || 'Origin Port',
      status: payload.status || 'CREATED',
      currentTemperature: payload.temperature !== undefined ? payload.temperature : null,
      temperatureAlert: false,
      lastEventId: _id || null,
      lastEventType: event.eventType || 'CONTAINER_CREATED',
      lastEventTimestamp: timestamp || new Date(),
      version: version || 1,
    };

    const container = await ContainerReadModel.findOneAndUpdate(
      { containerId: aggregateId, version: { $lt: version || 1 } },
      { $set: containerData },
      { upsert: true, new: true }
    );

    return container;
  }
}

module.exports = new ContainerProjectionHandler();
