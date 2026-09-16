const projectionWorker = require('./projectionWorker');

/**
 * Projection Worker Event Listener (Member 4 - Item #19)
 * 
 * Registers all domain event listeners on the projection worker.
 * Binds error handling, lifecycle hooks, and event monitoring.
 */

/**
 * Register all projection worker listeners and start the worker
 */
function registerWorkerListeners() {
  // Listen for worker errors
  projectionWorker.on('error', (err) => {
    console.error('[ProjectionWorker] Unhandled worker error:', err.message);
  });

  // Log projection processed milestones
  projectionWorker.on('event', (event) => {
    if (projectionWorker.processedCount % 100 === 0 && projectionWorker.processedCount > 0) {
      console.log(`[ProjectionWorker] Milestone: ${projectionWorker.processedCount} events projected`);
    }
  });

  // Start the worker
  projectionWorker.start();

  console.log('[ProjectionWorker] Event listeners registered and worker started');
  return projectionWorker;
}

/**
 * Graceful shutdown of the projection worker
 */
function shutdownWorker() {
  projectionWorker.stop();
  console.log('[ProjectionWorker] Worker shutdown complete');
}

module.exports = { registerWorkerListeners, shutdownWorker };
