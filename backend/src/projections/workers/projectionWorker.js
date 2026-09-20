const { projectContainer, rebuildAllProjections } = require('./projectionService');
const { getEventById } = require('../events/services/eventStore');
const logger = require('../utils/logger');

class ProjectionWorker {
  constructor() {
    this.isRunning = false;
    this.interval = null;
    this.processingInterval = 1000; // 1 second
    this.lastProcessedEventId = null;
    this.stats = {
      processed: 0,
      failed: 0,
      lastRun: null
    };
  }

  async start() {
    if (this.isRunning) {
      logger.warn('Projection worker is already running');
      return;
    }

    this.isRunning = true;
    logger.info('🔄 Projection worker started');

    await this.rebuild();

    this.interval = setInterval(async () => {
      await this.processNewEvents();
    }, this.processingInterval);
  }


  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isRunning = false;
    logger.info('🛑 Projection worker stopped');
  }


  async rebuild() {
    try {
      logger.info('🔄 Rebuilding all projections...');
      const result = await rebuildAllProjections();
      this.stats.lastRun = new Date();
      logger.info(`✅ Rebuild complete: ${result.success}/${result.total}`);
    } catch (error) {
      logger.error(`Rebuild failed: ${error.message}`);
    }
  }

  async processNewEvents() {
    try {
      const Event = require('../events/models/Event');
      

      const query = this.lastProcessedEventId 
        ? { _id: { $gt: this.lastProcessedEventId } }
        : {};
      
      const events = await Event.find(query)
        .sort({ timestamp: 1 })
        .limit(100);

      if (events.length === 0) return;

      const aggregates = [...new Set(events.map(e => e.aggregateId))];
      
      for (const aggregateId of aggregates) {
        try {
          await projectContainer(aggregateId);
          this.stats.processed++;
        } catch (error) {
          this.stats.failed++;
          logger.error(`Failed to project ${aggregateId}: ${error.message}`);
        }
      }

      if (events.length > 0) {
        this.lastProcessedEventId = events[events.length - 1]._id;
      }

      this.stats.lastRun = new Date();

    } catch (error) {
      logger.error(`Failed to process new events: ${error.message}`);
    }
  }

  getStats() {
    return {
      ...this.stats,
      isRunning: this.isRunning,
      lastProcessedEventId: this.lastProcessedEventId
    };
  }
}


const worker = new ProjectionWorker();

module.exports = worker;
