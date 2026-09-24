import mongoose from 'mongoose';

const slaPolicySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Policy name is required'],
      trim: true,
    },
    priorityLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      required: true,
      unique: true,
    },
    responseTimeMinutes: {
      type: Number,
      required: [true, 'Response time in minutes is required'],
      min: 5,
    },
    resolutionTimeMinutes: {
      type: Number,
      required: [true, 'Resolution time in minutes is required'],
      min: 10,
    },
    businessHoursOnly: {
      type: Boolean,
      default: true,
    },
    escalationChain: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const SLAPolicy = mongoose.model('SLAPolicy', slaPolicySchema);
