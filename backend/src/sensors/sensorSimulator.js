const { recordTemperature } = require('./temperatureService');
const { getAllAggregates } = require('../events/services/eventStore');
const logger = require('../utils/logger');

class SensorSimulator {
  constructor() {
    this.isRunning = false;
    this.interval = null;
    this.intervalMs = 30000; // 30 seconds
    this.temperatureRange = {
      min: 2,
      max: 18,
      normal: 5
    };
  }

  start() {
    if (this.isRunning) {
      logger.warn('Sensor simulator already running');
      return;
    }

    this.isRunning = true;
    logger.info('🌡️ Sensor simulator started');

    this.interval = setInterval(async () => {
      await this.simulateReadings();
    }, this.intervalMs);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isRunning = false;
    logger.info('🛑 Sensor simulator stopped');
  }

  async simulateReadings() {
    try {
      const aggregates = await getAllAggregates();
      
      for (const aggregateId of aggregates) {
        const temperature = this.generateTemperature();
        
        await recordTemperature(aggregateId, temperature, {
          sensorId: `SENSOR-${aggregateId}`,
          simulated: true
        });
      }

      logger.debug(`Simulated readings for ${aggregates.length} containers`);

    } catch (error) {
      logger.error(`Simulator error: ${error.message}`);
    }
  }


  generateTemperature() {
    const rand = Math.random();
    
    if (rand < 0.05) {
      return this.temperatureRange.max + Math.random() * 5;
    }
    
    if (rand < 0.20) {
      return 10 + Math.random() * 5;
    }
    
    return this.temperatureRange.min + Math.random() * (this.temperatureRange.normal - this.temperatureRange.min);
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      intervalMs: this.intervalMs,
      temperatureRange: this.temperatureRange
    };
  }
}


const simulator = new SensorSimulator();

module.exports = simulator;
