const projectionModule = require('./projectionModule');
const projectionWorker = require('./workers/projectionWorker');
const { registerWorkerListeners } = require('./workers/workerEventListener');
const projectionSocketEvents = require('./events/projectionSocketEvents');
const retryMechanism = require('./dlq/retryMechanism');

/**
 * Projection System Orchestrator (Member 4 - Item #25 FINAL COMMIT)
 * 
 * Central coordinator that boots up Read Model indexes, starts Projection Worker,
 * attaches Socket.IO event emitters, and runs pending DLQ retries.
 */
class ProjectionSystem {
  constructor() {
    this.isBooted = false;
  }

  /**
   * Boot the full Projection Subsystem
   * @param {Object} io Optional Socket.IO server instance
   */
  async boot(io = null) {
    if (this.isBooted) {
      console.log('[ProjectionSystem] Subsystem already booted');
      return this;
    }

    // 1. Initialize models & indexes
    await projectionModule.initialize();

    // 2. Attach Socket.IO if provided
    if (io) {
      projectionSocketEvents.init(io);
    }

    // 3. Register worker event listeners and start worker
    registerWorkerListeners();

    // 4. Process any pending DLQ retries from previous runs
    await retryMechanism.processPendingRetries();

    this.isBooted = true;
    console.log('🚀 [ProjectionSystem] Member 4 Projections Subsystem fully booted and operational!');
    return this;
  }
}

module.exports = new ProjectionSystem();
