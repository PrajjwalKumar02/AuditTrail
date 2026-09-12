const projectionService = require('../../projections/services/projectionService');
const ContainerReadModel = require('../../projections/models/ContainerReadModel');
const locationProjectionHandler = require('../../projections/handlers/locationProjectionHandler');

describe('Member 4 - Projection Service & Handler Tests', () => {
  it('should project location update event correctly via location handler', async () => {
    const mockEvent = {
      _id: 'event_123',
      aggregateId: 'CONT_TEST_001',
      eventType: 'CONTAINER_MOVED',
      payload: { location: 'Port of Mumbai' },
      version: 1,
      timestamp: new Date(),
    };

    jest.spyOn(ContainerReadModel, 'findOneAndUpdate').mockResolvedValue({
      containerId: 'CONT_TEST_001',
      currentLocation: 'Port of Mumbai',
      version: 1,
    });

    const result = await locationProjectionHandler.handleLocationUpdated(mockEvent);

    expect(result).toBeDefined();
    expect(result.currentLocation).toBe('Port of Mumbai');
    expect(result.containerId).toBe('CONT_TEST_001');

    ContainerReadModel.findOneAndUpdate.mockRestore();
  });

  it('should project temperature spike event and trigger alert', async () => {
    const mockEvent = {
      _id: 'event_124',
      aggregateId: 'CONT_TEST_001',
      eventType: 'TEMPERATURE_SPIKE',
      payload: { temperature: 25.5 },
      version: 2,
      timestamp: new Date(),
    };

    jest.spyOn(ContainerReadModel, 'findOneAndUpdate').mockResolvedValue({
      containerId: 'CONT_TEST_001',
      currentTemperature: 25.5,
      temperatureAlert: true,
      status: 'ALERT_SPIKE',
      version: 2,
    });

    const result = await projectionService.projectTemperature(mockEvent);

    expect(result).toBeDefined();
    expect(result.temperatureAlert).toBe(true);
    expect(result.status).toBe('ALERT_SPIKE');

    ContainerReadModel.findOneAndUpdate.mockRestore();
  });
});
