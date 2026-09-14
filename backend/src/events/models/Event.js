const mongoose = require('mongoose');
const eventSchema = new mongoose.Schema(
  {
    aggregateId: {
      type: String,
      required: [true, 'Aggregate ID is required'],
      index: true,
      trim: true
    },
    aggregateType: {
      type: String,
      required: [true, 'Aggregate type is required'],
      enum: ['Container', 'Inventory', 'Transaction'],
      default: 'Container'
    },
    eventType: {
      type: String,
      required: [true, 'Event type is required'],
      trim: true
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Event payload is required']
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    },
    version: {
      type: Number,
      required: [true, 'Version is required'],
      min: 1
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    previousHash: {
      type: String,
      required: [true, 'Previous hash is required'],
      default: '0'.repeat(64)
    },
    currentHash: {
      type: String,
      required: [true, 'Current hash is required'],
      unique: true,
      index: true
    }
  },
  {
    timestamps: true,
    strict: 'throw'
  }
);

eventSchema.pre('updateOne', function() {
  throw new Error('❌ Events are immutable! Updates are not allowed.');
});

eventSchema.pre('updateMany', function() {
  throw new Error('❌ Events are immutable! Updates are not allowed.');
});

eventSchema.pre('findOneAndUpdate', function() {
  throw new Error('❌ Events are immutable! Updates are not allowed.');
});

eventSchema.pre('deleteOne', function() {
  throw new Error('❌ Events are immutable! Deletions are not allowed.');
});

eventSchema.pre('deleteMany', function() {
  throw new Error('❌ Events are immutable! Deletions are not allowed.');
});

eventSchema.pre('findOneAndDelete', function() {
  throw new Error('❌ Events are immutable! Deletions are not allowed.');
});

eventSchema.index({ aggregateId: 1, version: 1 }, { unique: true });
eventSchema.index({ aggregateId: 1, timestamp: 1 });
eventSchema.index({ eventType: 1 });
eventSchema.index({ currentHash: 1 });

eventSchema.virtual('isFirstEvent').get(function() {
  return this.version === 1;
});

eventSchema.virtual('isLastEvent').get(function() {
  // This would need to be computed
  return false;
});

eventSchema.methods.verifyHash = function() {
  const { generateHash } = require('../services/hash');
  const computed = generateHash({
    previousHash: this.previousHash,
    payload: this.payload,
    version: this.version,
    timestamp: this.timestamp,
    aggregateId: this.aggregateId,
    eventType: this.eventType
  });
  return computed === this.currentHash;
};


eventSchema.statics.getNextVersion = async function(aggregateId) {
  const lastEvent = await this.findOne({ aggregateId })
    .sort({ version: -1 })
    .select('version');
  return lastEvent ? lastEvent.version + 1 : 1;
};


eventSchema.statics.aggregateExists = async function(aggregateId) {
  const count = await this.countDocuments({ aggregateId });
  return count > 0;
};


eventSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Event', eventSchema);
