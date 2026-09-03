const ContainerReadModel = require('../models/ContainerReadModel');
const InventoryReadModel = require('../models/InventoryReadModel');

/**
 * Projection Service (Member 4 - Commit #4)
 * 
 * Responsible for applying incoming domain events to update the Read Models (MongoDB).
 */
class ProjectionService {
  /**
   * Project a location update event into the Container Read Model
   * Handles events like CONTAINER_CREATED, CONTAINER_MOVED, ARRIVED_AT_PORT
   * 
   * @param {Object} event Raw domain event from Event Store
   */
  async projectLocation(event) {
    const { aggregateId, eventType, payload, version, timestamp, _id } = event;

    if (!aggregateId) {
      throw new Error('Event missing aggregateId');
    }

    const location = payload.location || payload.currentLocation || payload.destination || 'In Transit';

    const updatedContainer = await ContainerReadModel.findOneAndUpdate(
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

    return updatedContainer;
  }
}

module.exports = new ProjectionService();
