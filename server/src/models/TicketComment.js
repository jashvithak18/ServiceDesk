import mongoose from 'mongoose';

const ticketCommentSchema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true,
      index: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    body: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
    },
    isInternalNote: {
      type: Boolean,
      default: false, // Technician-only note vs public requester comment
    },
    attachments: [
      {
        filename: String,
        path: String,
        mimetype: String,
        size: Number,
      },
    ],
  },
  { timestamps: true }
);

export const TicketComment = mongoose.model('TicketComment', ticketCommentSchema);
