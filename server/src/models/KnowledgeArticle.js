import mongoose from 'mongoose';

const knowledgeArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Article title is required'],
      trim: true,
    },
    body: {
      type: String,
      required: [true, 'Article body content is required'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TicketCategory',
      required: true,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Full text search index
knowledgeArticleSchema.index({ title: 'text', body: 'text', tags: 'text' });

export const KnowledgeArticle = mongoose.model('KnowledgeArticle', knowledgeArticleSchema);
