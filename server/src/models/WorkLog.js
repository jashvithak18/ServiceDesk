import mongoose from 'mongoose';

const workLogSchema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true,
      index: true,
    },
    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Work log description is required'],
      trim: true,
    },
    timeSpentMinutes: {
      type: Number,
      required: [true, 'Time spent in minutes is required'],
      min: [1, 'Time spent must be at least 1 minute'],
    },
  },
  { timestamps: true }
);

export const WorkLog = mongoose.model('WorkLog', workLogSchema);
