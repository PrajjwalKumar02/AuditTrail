const mongoose = require('mongoose');

/**
 * Container Read Model Schema (Member 4 - Item #17)
 * 
 * Highly optimized Mongoose model with compound indexes for high-speed read queries.
 */
const containerReadModelSchema = new mongoose.Schema(
  {
    containerId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    currentLocation: {
      type: String,
      default: 'Unknown',
      index: true,
    },
    status: {
      type: String,
      enum: ['CREATED', 'IN_TRANSIT', 'LOADED_ON_SHIP', 'ARRIVED_AT_PORT', 'DELIVERED', 'ALERT_SPIKE'],
      default: 'CREATED',
      index: true,
    },
    currentTemperature: {
      type: Number,
      default: null,
    },
    temperatureAlert: {
      type: Boolean,
      default: false,
    },
    lastEventId: {
      type: String,
      default: null,
    },
    lastEventType: {
      type: String,
      default: null,
    },
    lastEventTimestamp: {
      type: Date,
      default: null,
    },
    version: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound indexes for fast filtering by status, location, alerts and timestamps (Item #17)
containerReadModelSchema.index({ status: 1, currentLocation: 1 });
containerReadModelSchema.index({ temperatureAlert: 1, status: 1 });
containerReadModelSchema.index({ currentLocation: 1, updatedAt: -1 });
containerReadModelSchema.index({ version: 1 });

const ContainerReadModel = mongoose.model('ContainerReadModel', containerReadModelSchema);

module.exports = ContainerReadModel;
