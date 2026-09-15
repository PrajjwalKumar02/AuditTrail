const ContainerReadModel = require('../models/ContainerReadModel');

/**
 * Version Projection Handler (Member 4 - Item #15)
 * 
 * Handles aggregate state version updates and optimistic concurrency control projections.
 */
class VersionProjectionHandler {
  /**
   * Project version updates to guarantee read model event sequence ordering
   * 
   * @param {Object} event Domain event
   */
  async handleVersionUpdated(event) {
    const { aggregateId, eventType, version, timestamp, _id } = event;

    if (!aggregateId) {
      throw new Error('Version projection event missing aggregateId');
    }

    const container = await ContainerReadModel.findOneAndUpdate(
      { containerId: aggregateId, version: { $lt: version || 1 } },
      {
        $set: {
          containerId: aggregateId,
          version: version || 1,
          lastEventId: _id || null,
          lastEventType: eventType || 'VERSION_UPDATED',
          lastEventTimestamp: timestamp || new Date(),
        },
      },
      { upsert: true, new: true }
    );

    return container;
  }
}

module.exports = new VersionProjectionHandler();
