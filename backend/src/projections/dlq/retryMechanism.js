const { DLQModel } = require('./dlqHandler');
const projectionService = require('../services/projectionService');

/**
 * Retry Mechanism for Failed Projections (Member 4 - Item #21)
 * 
 * Implements exponential backoff automatic retries for events in the Dead Letter Queue.
 */
class RetryMechanism {
  constructor(maxRetries = 3, backoffDelayMs = 1000) {
    this.maxRetries = maxRetries;
    this.backoffDelayMs = backoffDelayMs;
  }

  /**
   * Process all pending DLQ items with exponential backoff retries
   */
  async processPendingRetries() {
    const pendingItems = await DLQModel.find({ status: 'PENDING_RETRY' });
    let resolvedCount = 0;
    let failedCount = 0;

    for (const item of pendingItems) {
      if (item.retryCount >= this.maxRetries) {
        item.status = 'FAILED_PERMANENT';
        await item.save();
        failedCount++;
        continue;
      }

      // Exponential backoff delay: 1s, 2s, 4s...
      const delay = this.backoffDelayMs * Math.pow(2, item.retryCount);
      await new Promise((resolve) => setTimeout(resolve, Math.min(delay, 5000)));

      try {
        await projectionService.projectEvent(item.event);
        item.status = 'RESOLVED';
        await item.save();
        resolvedCount++;
        console.log(`[RetryMechanism] Successfully re-projected DLQ event ${item._id}`);
      } catch (err) {
        item.retryCount += 1;
        item.errorReason = err.message;
        if (item.retryCount >= this.maxRetries) {
          item.status = 'FAILED_PERMANENT';
        }
        await item.save();
        console.error(`[RetryMechanism] Retry #${item.retryCount} failed for DLQ event ${item._id}:`, err.message);
      }
    }

    return { resolvedCount, failedCount, total: pendingItems.length };
  }
}

module.exports = new RetryMechanism();
