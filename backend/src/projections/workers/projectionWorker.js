const EventEmitter = require('events');
const projectionService = require('./services/projectionService');

/**
 * Projection Worker (Member 4 - Item #18)
 * 
 * Background worker that listens to emitted domain events and automatically
 * updates Read Model collections in real-time.
 */
class ProjectionWorker extends EventEmitter {
  constructor() {
    super();
    this.isRunning = false;
    this.processedCount = 0;
    this.errorCount = 0;
  }

  /**
   * Start the projection worker and bind event listeners
   */
  start() {
    if (this.isRunning) return this;

    this.isRunning = true;
    this.on('event', this._handleEvent.bind(this));

    console.log('[ProjectionWorker] Background worker started and listening for events');
    return this;
  }

  /**
   * Stop the projection worker gracefully
   */
  stop() {
    this.isRunning = false;
    this.removeAllListeners('event');
    console.log(`[ProjectionWorker] Worker stopped. Processed: ${this.processedCount}, Errors: ${this.errorCount}`);
  }

  /**
   * Emit a new domain event for projection processing
   * @param {Object} event Domain event object
   */
  dispatch(event) {
    if (!this.isRunning) {
      console.warn('[ProjectionWorker] Worker is not running. Call start() first.');
      return;
    }
    this.emit('event', event);
  }

  /**
   * Internal event handler - processes the event through projection service
   * @param {Object} event Domain event
   */
  async _handleEvent(event) {
    try {
      await projectionService.projectEvent(event);
      this.processedCount++;
    } catch (error) {
      this.errorCount++;
      console.error(`[ProjectionWorker] Failed to project event ${event?.eventType}:`, error.message);
    }
  }

  /**
   * Get current worker health stats
   */
  getStats() {
    return {
      isRunning: this.isRunning,
      processedCount: this.processedCount,
      errorCount: this.errorCount,
    };
  }
}

module.exports = new ProjectionWorker();
