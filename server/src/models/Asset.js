import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema(
  {
    assetTag: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    serialNumber: {
      type: String,
      required: [true, 'Serial number is required'],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Asset name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['Laptop', 'Monitor', 'Server', 'Mobile', 'Peripherals', 'Other'],
      default: 'Laptop',
      index: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      default: null,
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    purchaseCost: {
      type: Number,
      default: 0,
    },
    warrantyExpiry: {
      type: Date,
      default: null,
      index: true,
    },
    status: {
      type: String,
      enum: ['in_stock', 'assigned', 'in_repair', 'retired'],
      default: 'in_stock',
      index: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      default: null,
      index: true,
    },
    lifecycleHistory: [
      {
        fromStatus: String,
        toStatus: String,
        assignedTo: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        notes: String,
      },
    ],
  },
  { timestamps: true }
);

// Text search index
assetSchema.index({ assetTag: 'text', serialNumber: 'text', name: 'text' });

export const Asset = mongoose.model('Asset', assetSchema);
