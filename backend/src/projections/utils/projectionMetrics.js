/**
 * Projection Performance Metrics Tracker (Member 4)
 * 
 * Records processing latency, throughput, and system health metrics for the Projection Engine.
 */
class ProjectionMetricsTracker {
  constructor() {
    this.startTime = Date.now();
    this.totalEventsProcessed = 0;
    this.totalProcessingTimeMs = 0;
    this.lastLatencyMs = 0;
  }

  /**
   * Record processing duration for an event
   * @param {Number} durationMs Execution time in milliseconds
   */
  recordEventProcessed(durationMs) {
    this.totalEventsProcessed += 1;
    this.totalProcessingTimeMs += durationMs;
    this.lastLatencyMs = durationMs;
  }

  /**
   * Fetch projection health and performance metrics summary
   */
  getMetricsSummary() {
    const uptimeSeconds = (Date.now() - this.startTime) / 1000;
    const avgLatencyMs = this.totalEventsProcessed > 0
      ? (this.totalProcessingTimeMs / this.totalEventsProcessed).toFixed(2)
      : 0;
    const throughputPerSec = uptimeSeconds > 0
      ? (this.totalEventsProcessed / uptimeSeconds).toFixed(2)
      : 0;

    return {
      uptimeSeconds: Math.floor(uptimeSeconds),
      totalEventsProcessed: this.totalEventsProcessed,
      avgLatencyMs: parseFloat(avgLatencyMs),
      lastLatencyMs: this.lastLatencyMs,
      throughputPerSec: parseFloat(throughputPerSec),
      memoryUsageMB: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
    };
  }
}

module.exports = new ProjectionMetricsTracker();
