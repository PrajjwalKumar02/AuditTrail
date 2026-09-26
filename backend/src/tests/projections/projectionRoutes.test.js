const projectionValidation = require('../../projections/middleware/projectionValidation');
const projectionMetrics = require('../../projections/utils/projectionMetrics');

describe('Member 4 - Query API Validation & Metrics Unit Tests', () => {
  it('should validate containerId route parameter correctly', () => {
    const req = { params: { id: 'CONT_999' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    projectionValidation.validateContainerId(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.params.id).toBe('CONT_999');
  });

  it('should reject invalid query limit parameter', () => {
    const req = { query: { limit: '-5' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    projectionValidation.validateQueryParams(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });

  it('should record performance metrics accurately', () => {
    projectionMetrics.recordEventProcessed(15);
    const summary = projectionMetrics.getMetricsSummary();

    expect(summary).toBeDefined();
    expect(summary.totalEventsProcessed).toBeGreaterThanOrEqual(1);
    expect(summary.lastLatencyMs).toBe(15);
  });
});
