const mongoose = require('mongoose');
const projectionWorker = require('../workers/projectionWorker');
const { DLQModel } = require('../dlq/dlqHandler');

/**
 * Projection Health Check Diagnostic Helper (Member 4)
 * 
 * Provides live diagnostic metrics on Projection Worker, MongoDB connection status,
 * and Dead Letter Queue health.
 */
class ProjectionHealthCheck {
  /**
   * Run full health check diagnosis
   */
  async runDiagnostic() {
    const isDbConnected = mongoose.connection.readyState === 1;
    const workerStats = projectionWorker.getStats();
    const pendingDlqCount = isDbConnected ? await DLQModel.countDocuments({ status: 'PENDING_RETRY' }) : 0;

    const isHealthy = isDbConnected && workerStats.errorCount === 0 && pendingDlqCount === 0;

    return {
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date(),
      database: {
        connected: isDbConnected,
        state: mongoose.connection.readyState,
      },
      worker: {
        running: workerStats.isRunning,
        processed: workerStats.processedCount,
        errors: workerStats.errorCount,
      },
      deadLetterQueue: {
        pendingRetries: pendingDlqCount,
      },
    };
  }
}

module.exports = new ProjectionHealthCheck();
