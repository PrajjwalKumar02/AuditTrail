const mongoose = require('mongoose');

const snapshotSchema = new mongoose.Schema(
  {
    aggregateId: {
      type: String,
      required: true,
      index: true
    },
    aggregateType: {
      type: String,
      required: true,
      default: 'Container'
    },
    state: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    version: {
      type: Number,
      required: true
    },
    eventCount: {
      type: Number,
      required: true
    },
    lastEventId: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
);


snapshotSchema.index({ aggregateId: 1, version: -1 });

module.exports = mongoose.model('Snapshot', snapshotSchema);
