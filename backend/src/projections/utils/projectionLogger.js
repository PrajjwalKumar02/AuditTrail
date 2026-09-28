/**
 * Structured Projection Logger Helper (Member 4)
 * 
 * Formats structured log output for projection event processing cycles.
 */
class ProjectionLogger {
  /**
   * Log projection start
   */
  logStart(eventType, aggregateId) {
    const timestamp = new Date().toISOString();
    console.log(`[PROJECTION_START] ${timestamp} | Event: ${eventType} | Aggregate: ${aggregateId}`);
  }

  /**
   * Log projection success
   */
  logSuccess(eventType, aggregateId, version, durationMs) {
    const timestamp = new Date().toISOString();
    console.log(`[PROJECTION_SUCCESS] ${timestamp} | Event: ${eventType} | Aggregate: ${aggregateId} | Version: ${version} | Duration: ${durationMs}ms`);
  }

  /**
   * Log projection failure
   */
  logError(eventType, aggregateId, error) {
    const timestamp = new Date().toISOString();
    console.error(`[PROJECTION_ERROR] ${timestamp} | Event: ${eventType} | Aggregate: ${aggregateId} | Error: ${error.message || error}`);
  }
}

module.exports = new ProjectionLogger();
