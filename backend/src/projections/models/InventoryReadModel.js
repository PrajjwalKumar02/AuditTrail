const mongoose = require('mongoose');

/**
 * Inventory Read Model Schema (Member 4 - Commit #3)
 * 
 * Highly optimized Mongoose collection for fast querying of inventory item stock levels and locations inside containers.
 * Updated continuously by Member 4's Projection Worker when raw events are emitted.
 */
const inventoryReadModelSchema = new mongoose.Schema(
  {
    inventoryId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    containerId: {
      type: String,
      required: true,
      index: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    unitValue: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['IN_STOCK', 'IN_TRANSIT', 'DAMAGED', 'DISPATCHED'],
      default: 'IN_STOCK',
      index: true,
    },
    lastEventVersion: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound index for querying inventory items by container
inventoryReadModelSchema.index({ containerId: 1, status: 1 });

const InventoryReadModel = mongoose.model('InventoryReadModel', inventoryReadModelSchema);

module.exports = InventoryReadModel;
