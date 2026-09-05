const ContainerReadModel = require('../models/ContainerReadModel');
const InventoryReadModel = require('../models/InventoryReadModel');

/**
 * Projection Service (Member 4 - Day 5: Commits #5 & #6)
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

  /**
   * Project status update into Container Read Model (Commit #5)
   * 
   * @param {Object} event Raw domain event
   */
  async projectStatus(event) {
    const { aggregateId, eventType, payload, version, timestamp, _id } = event;

    if (!aggregateId) {
      throw new Error('Event missing aggregateId');
    }

    const status = payload.status || (eventType === 'DELIVERED' ? 'DELIVERED' : 'IN_TRANSIT');

    const updatedContainer = await ContainerReadModel.findOneAndUpdate(
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

    return updatedContainer;
  }

  /**
   * Project temperature readings and sensor spikes into Container Read Model (Commit #6)
   * Automatically triggers temperature alerts if values exceed safety limits.
   * 
   * @param {Object} event Raw domain event
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

    const updatedContainer = await ContainerReadModel.findOneAndUpdate(
      { containerId: aggregateId, version: { $lt: version } },
      { $set: updateFields },
      { upsert: true, new: true }
    );

    return updatedContainer;
  }
}

module.exports = new ProjectionService();
