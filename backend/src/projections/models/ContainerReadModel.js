const mongoose = require('mongoose');

/**
 * Container Read Model Schema (Member 4 - Commit #2)
 * 
 * Highly optimized Mongoose model for storing and fast-querying shipping container current states.
 * Updated continuously by Member 4's Projection Worker when raw events are emitted.
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

// Compound index for fast filtering by status and location
containerReadModelSchema.index({ status: 1, currentLocation: 1 });

const ContainerReadModel = mongoose.model('ContainerReadModel', containerReadModelSchema);

module.exports = ContainerReadModel;
