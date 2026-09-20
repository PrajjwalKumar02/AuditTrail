const mongoose = require('mongoose');

const containerReadModelSchema = new mongoose.Schema(
  {
    aggregateId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    location: {
      type: String,
      index: true
    },
    status: {
      type: String,
      index: true,
      enum: ['CREATED', 'LOADED', 'IN_TRANSIT', 'ARRIVED', 'DELAYED', 'DAMAGED', 'INSPECTED', 'ALERT', 'WARNING']
    },
    ship: {
      type: String,
      index: true
    },
    temperature: {
      type: Number
    },
    temperatureHistory: [{
      value: Number,
      timestamp: Date,
      alert: Boolean
    }],
    lastEventVersion: {
      type: Number,
      required: true
    },
    lastEventType: {
      type: String
    },
    lastEventTimestamp: {
      type: Date
    },
    totalEvents: {
      type: Number,
      default: 0
    },
    alerts: [{
      type: {
        type: String,
        enum: ['TEMPERATURE', 'DELAY', 'DAMAGE', 'STOCK']
      },
      message: String,
      severity: {
        type: String,
        enum: ['info', 'warning', 'critical']
      },
      timestamp: Date,
      acknowledged: {
        type: Boolean,
        default: false
      }
    }],
    timeline: [{
      version: Number,
      eventType: String,
      timestamp: Date,
      summary: String
    }]
  },
  {
    timestamps: true
  }
);

containerReadModelSchema.index({ status: 1, updatedAt: -1 });
containerReadModelSchema.index({ location: 1, status: 1 });
containerReadModelSchema.index({ ship: 1, status: 1 });
containerReadModelSchema.index({ 'alerts.acknowledged': 1 });

containerReadModelSchema.virtual('alertCount').get(function() {
  return this.alerts ? this.alerts.length : 0;
});

containerReadModelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('ContainerReadModel', containerReadModelSchema);
