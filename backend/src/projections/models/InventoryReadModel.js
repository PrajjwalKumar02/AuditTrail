const mongoose = require('mongoose');

/**
 * Inventory Read Model Schema (Member 4 - Item #17)
 * 
 * Highly optimized Mongoose collection for fast querying of inventory item stock levels and locations.
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

// Compound indexes for fast querying of inventory items by container and status (Item #17)
inventoryReadModelSchema.index({ containerId: 1, status: 1 });
inventoryReadModelSchema.index({ containerId: 1, itemName: 1 });
inventoryReadModelSchema.index({ status: 1, updatedAt: -1 });

const InventoryReadModel = mongoose.model('InventoryReadModel', inventoryReadModelSchema);

module.exports = InventoryReadModel;
