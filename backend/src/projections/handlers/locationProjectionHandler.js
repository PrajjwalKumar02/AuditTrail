const ContainerReadModel = require('../models/ContainerReadModel');

/**
 * Location Projection Handler (Member 4 - Item #12)
 * 
 * Handles container location updates, GPS tracking changes, and port arrival projections.
 */
class LocationProjectionHandler {
  /**
   * Project location updates (e.g. CONTAINER_MOVED, LOCATION_UPDATED, ARRIVED_AT_PORT)
   * 
   * @param {Object} event Domain event
   */
  async handleLocationUpdated(event) {
    const { aggregateId, eventType, payload, version, timestamp, _id } = event;

    if (!aggregateId) {
      throw new Error('Location projection event missing aggregateId');
    }

    const newLocation = payload.location || payload.currentLocation || payload.destination || 'In Transit';

    const container = await ContainerReadModel.findOneAndUpdate(
      { containerId: aggregateId, version: { $lt: version || 1 } },
      {
        $set: {
          containerId: aggregateId,
          currentLocation: newLocation,
          lastEventId: _id || null,
          lastEventType: eventType || 'LOCATION_UPDATED',
          lastEventTimestamp: timestamp || new Date(),
          version: version || 1,
        },
      },
      { upsert: true, new: true }
    );

    return container;
  }
}

module.exports = new LocationProjectionHandler();
