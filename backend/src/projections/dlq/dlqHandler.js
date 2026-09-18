const mongoose = require('mongoose');

/**
 * Dead Letter Queue (DLQ) Schema (Member 4 - Item #20)
 */
const dlqSchema = new mongoose.Schema(
  {
    event: {
      type: Object,
      required: true,
    },
    errorReason: {
      type: String,
      required: true,
    },
    retryCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['PENDING_RETRY', 'FAILED_PERMANENT', 'RESOLVED'],
      default: 'PENDING_RETRY',
    },
  },
  { timestamps: true }
);

const DLQModel = mongoose.model('DLQ', dlqSchema);

/**
 * DLQ Handler Service
 */
class DLQHandler {
  /**
   * Move failed event to Dead Letter Queue
   * 
   * @param {Object} event Malformed or failed domain event
   * @param {Error|String} error Failure reason
   */
  async enqueueFailedEvent(event, error) {
    try {
      const dlqItem = await DLQModel.create({
        event,
        errorReason: typeof error === 'string' ? error : error.message,
        retryCount: 0,
        status: 'PENDING_RETRY',
      });
      console.error(`[DLQ] Event ${event?.eventType} enqueued to Dead Letter Queue ID: ${dlqItem._id}`);
      return dlqItem;
    } catch (err) {
      console.error('[DLQ] Critical error logging to DLQ:', err.message);
    }
  }

  /**
   * Fetch pending DLQ items
   */
  async getPendingEvents() {
    return await DLQModel.find({ status: 'PENDING_RETRY' }).sort({ createdAt: -1 });
  }

  /**
   * Mark DLQ event as resolved
   */
  async resolveEvent(dlqId) {
    return await DLQModel.findByIdAndUpdate(dlqId, { status: 'RESOLVED' }, { new: true });
  }
}

module.exports = {
  DLQModel,
  dlqHandler: new DLQHandler(),
};
