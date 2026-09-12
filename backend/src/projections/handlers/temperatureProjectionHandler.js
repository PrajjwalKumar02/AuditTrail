const ContainerReadModel = require('../models/ContainerReadModel');

/**
 * Temperature Projection Handler (Member 4 - Item #14)
 * 
 * Handles IoT sensor temperature readings, threshold checks, and temperature alert projections.
 */
class TemperatureProjectionHandler {
  /**
   * Project temperature readings and temperature spikes
   * 
   * @param {Object} event Domain event
   */
  async handleTemperatureRecorded(event) {
    const { aggregateId, eventType, payload, version, timestamp, _id } = event;

    if (!aggregateId) {
      throw new Error('Temperature projection event missing aggregateId');
    }

    const temp = payload.temperature !== undefined ? payload.temperature : payload.temp;
    const isAlert = temp > 10.0 || eventType === 'TEMPERATURE_SPIKE';

    const updateFields = {
      containerId: aggregateId,
      currentTemperature: temp,
      temperatureAlert: isAlert,
      lastEventId: _id || null,
      lastEventType: eventType || 'TEMPERATURE_READING',
      lastEventTimestamp: timestamp || new Date(),
      version: version || 1,
    };

    if (isAlert) {
      updateFields.status = 'ALERT_SPIKE';
    }

    const container = await ContainerReadModel.findOneAndUpdate(
      { containerId: aggregateId, version: { $lt: version || 1 } },
      { $set: updateFields },
      { upsert: true, new: true }
    );

    return container;
  }
}

module.exports = new TemperatureProjectionHandler();
