import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Ticket title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Ticket description is required'],
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TicketCategory',
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
      index: true,
    },
    status: {
      type: String,
      enum: ['new', 'assigned', 'in_progress', 'on_hold', 'resolved', 'closed'],
      default: 'new',
      index: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      default: null,
      index: true,
    },
    responseDeadline: {
      type: Date,
      default: null,
    },
    resolutionDeadline: {
      type: Date,
      default: null,
      index: true,
    },
    isSlaBreached: {
      type: Boolean,
      default: false,
      index: true,
    },
    escalationLevel: {
      type: Number,
      default: 0,
    },
    attachments: [
      {
        filename: String,
        path: String,
        mimetype: String,
        size: Number,
      },
    ],
    watchers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    resolvedAt: {
      type: Date,
      default: null,
    },
    reopenCount: {
      type: Number,
      default: 0,
    },
    statusHistory: [
      {
        fromStatus: String,
        toStatus: String,
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        reason: String,
      },
    ],
  },
  { timestamps: true }
);

// Full text search index on title & description
ticketSchema.index({ title: 'text', description: 'text' });

export const Ticket = mongoose.model('Ticket', ticketSchema);
