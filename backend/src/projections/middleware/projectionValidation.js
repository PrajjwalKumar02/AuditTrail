/**
 * Projection Query Validation Middleware (Member 4)
 * 
 * Validates HTTP query parameters and route IDs before hitting query controllers.
 */
class ProjectionValidation {
  /**
   * Validate container ID URL parameter
   */
  validateContainerId(req, res, next) {
    const { id } = req.params;
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or missing containerId parameter',
      });
    }
    req.params.id = id.trim();
    next();
  }

  /**
   * Validate container query parameters (status, location, limit)
   */
  validateQueryParams(req, res, next) {
    const { limit, status } = req.query;

    if (limit && (isNaN(parseInt(limit)) || parseInt(limit) <= 0)) {
      return res.status(400).json({
        success: false,
        error: 'Limit query parameter must be a positive integer',
      });
    }

    const validStatuses = ['CREATED', 'IN_TRANSIT', 'LOADED_ON_SHIP', 'ARRIVED_AT_PORT', 'DELIVERED', 'ALERT_SPIKE'];
    if (status && !validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        error: `Invalid status parameter. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    next();
  }
}

module.exports = new ProjectionValidation();
