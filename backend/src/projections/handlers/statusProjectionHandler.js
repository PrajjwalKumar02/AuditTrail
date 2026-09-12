const ContainerReadModel = require('../models/ContainerReadModel');

/**
 * Status Projection Handler (Member 4 - Item #13)
 * 
 * Handles container status transition projections (CREATED, IN_TRANSIT, LOADED_ON_SHIP, ARRIVED_AT_PORT, DELIVERED).
 */
class StatusProjectionHandler {
  /**
   * Project status updates (e.g. STATUS_UPDATED, LOADED_ON_SHIP, DELIVERED)
   * 
   * @param {Object} event Domain event
   */
  async handleStatusUpdated(event) {
    const { aggregateId, eventType, payload, version, timestamp, _id } = event;

    if (!aggregateId) {
      throw new Error('Status projection event missing aggregateId');
    }

    let status = payload.status;
    if (!status) {
      if (eventType === 'DELIVERED') status = 'DELIVERED';
      else if (eventType === 'LOADED_ON_SHIP') status = 'LOADED_ON_SHIP';
      else status = 'IN_TRANSIT';
    }

    const container = await ContainerReadModel.findOneAndUpdate(
      { containerId: aggregateId, version: { $lt: version || 1 } },
      {
        $set: {
          containerId: aggregateId,
          status: status,
          lastEventId: _id || null,
          lastEventType: eventType || 'STATUS_UPDATED',
          lastEventTimestamp: timestamp || new Date(),
          version: version || 1,
        },
      },
      { upsert: true, new: true }
    );

    return container;
  }
}

module.exports = new StatusProjectionHandler();
