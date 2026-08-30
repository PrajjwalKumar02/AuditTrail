const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    aggregateId: {
      type: String,
      required: true,
      index: true,
    },

    aggregateType: {
      type: String,
      required: true,
    },

    eventType: {
      type: String,
      required: true,
    },

    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    version: {
      type: Number,
      required: true,
      min: 1,
    },

    timestamp: {
      type: Date,
      default: Date.now,
      immutable: true,
    },

    previousHash: {
      type: String,
      default: null,
      immutable: true,
    },

    hash: {
      type: String,
      default: null,
      immutable: true,
    },
  },
  {
    versionKey: false,
  }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;