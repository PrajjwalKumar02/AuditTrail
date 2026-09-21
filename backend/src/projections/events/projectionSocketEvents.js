/**
 * Projection Socket Events (Member 4 - Item #24)
 * 
 * Handles real-time WebSocket emissions to frontend dashboards when Read Models are updated or alerts occur.
 */
class ProjectionSocketEvents {
  constructor() {
    this.io = null;
  }

  /**
   * Initialize Socket.IO instance
   * @param {Object} io Socket.IO server instance
   */
  init(io) {
    this.io = io;
    console.log('[ProjectionSocketEvents] Socket.IO real-time event engine initialized');
  }

  /**
   * Broadcast projection update event to connected clients
   * @param {Object} projection Updated container or inventory read model
   */
  broadcastProjectionUpdate(projection) {
    if (!this.io) return;
    this.io.emit('projection:updated', {
      timestamp: new Date(),
      data: projection,
    });
  }

  /**
   * Broadcast temperature spike alert to live dashboard
   * @param {Object} alertPayload Alert metadata
   */
  broadcastAlert(alertPayload) {
    if (!this.io) return;
    this.io.emit('projection:alert', {
      timestamp: new Date(),
      alert: alertPayload,
    });
  }
}

module.exports = new ProjectionSocketEvents();
