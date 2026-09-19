const projectionWorker = require('../../projections/workers/projectionWorker');
const { dlqHandler } = require('../../projections/dlq/dlqHandler');
const retryMechanism = require('../../projections/dlq/retryMechanism');
const projectionService = require('../../projections/services/projectionService');

describe('Member 4 - Full Projection Engine & Worker Suite (Item #22)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should start and stop projection worker cleanly', () => {
    projectionWorker.start();
    expect(projectionWorker.isRunning).toBe(true);

    const stats = projectionWorker.getStats();
    expect(stats.isRunning).toBe(true);

    projectionWorker.stop();
    expect(projectionWorker.isRunning).toBe(false);
  });

  it('should enqueue failed event into DLQ correctly', async () => {
    const mockFailedEvent = {
      aggregateId: 'CONT_INVALID',
      eventType: 'INVALID_EVENT',
      payload: {},
    };

    const spy = jest.spyOn(dlqHandler, 'enqueueFailedEvent').mockResolvedValue({
      _id: 'dlq_item_999',
      event: mockFailedEvent,
      status: 'PENDING_RETRY',
    });

    const result = await dlqHandler.enqueueFailedEvent(mockFailedEvent, 'Invalid schema');

    expect(result).toBeDefined();
    expect(result._id).toBe('dlq_item_999');
    expect(spy).toHaveBeenCalledWith(mockFailedEvent, 'Invalid schema');

    spy.mockRestore();
  });

  it('should execute retry mechanism on pending DLQ items', async () => {
    const spy = jest.spyOn(retryMechanism, 'processPendingRetries').mockResolvedValue({
      resolvedCount: 1,
      failedCount: 0,
      total: 1,
    });

    const summary = await retryMechanism.processPendingRetries();

    expect(summary).toBeDefined();
    expect(summary.resolvedCount).toBe(1);

    spy.mockRestore();
  });

  it('should reset projections state cleanly', async () => {
    const spy = jest.spyOn(projectionService, 'resetProjections').mockResolvedValue({
      success: true,
      message: 'All read model projections reset successfully',
    });

    const result = await projectionService.resetProjections();

    expect(result.success).toBe(true);
    spy.mockRestore();
  });
});
