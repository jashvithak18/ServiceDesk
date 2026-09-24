import { KnowledgeArticle } from '../models/KnowledgeArticle.js';

// @desc    Get Knowledge Base articles (Search, filter by category/tag)
// @route   GET /api/kb
// @access  Private (All Roles)
export const getArticles = async (req, res, next) => {
  try {
    const { search, category, tag } = req.query;

    const query = { isPublished: true };

    if (category) query.category = category;
    if (tag) query.tags = tag;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { body: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const articles = await KnowledgeArticle.find(query)
      .populate('category', 'name defaultPriority')
      .populate('createdBy', 'name email role avatarColor')
      .sort({ upvotes: -1, createdAt: -1 });

    res.status(200).json({ success: true, count: articles.length, data: articles });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single article & increment view counter
// @route   GET /api/kb/:id
// @access  Private (All Roles)
export const getArticleById = async (req, res, next) => {
  try {
    const article = await KnowledgeArticle.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('category', 'name defaultPriority')
      .populate('createdBy', 'name email role avatarColor');

    if (!article) {
      res.status(404);
      throw new Error('Knowledge Base Article not found');
    }

    res.status(200).json({ success: true, data: article });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new Knowledge Base article
// @route   POST /api/kb
// @access  Private (Technician, IT Manager, Admin)
export const createArticle = async (req, res, next) => {
  try {
    const { title, body, categoryId, tags } = req.body;

    if (!title || !body || !categoryId) {
      res.status(400);
      throw new Error('Title, body content, and category are required');
    }

    const formattedTags = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
      ? tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const article = await KnowledgeArticle.create({
      title: title.trim(),
      body: body.trim(),
      category: categoryId,
      tags: formattedTags,
      createdBy: req.user._id,
    });

    const populated = await KnowledgeArticle.findById(article._id)
      .populate('category', 'name')
      .populate('createdBy', 'name email role');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Upvote a Knowledge Base article
// @route   POST /api/kb/:id/upvote
// @access  Private
export const upvoteArticle = async (req, res, next) => {
  try {
    const article = await KnowledgeArticle.findByIdAndUpdate(
      req.params.id,
      { $inc: { upvotes: 1 } },
      { new: true }
    );

    if (!article) {
      res.status(404);
      throw new Error('Article not found');
    }

    res.status(200).json({ success: true, data: article });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Knowledge Base article
// @route   DELETE /api/kb/:id
// @access  Private (IT Manager, Admin)
export const deleteArticle = async (req, res, next) => {
  try {
    await KnowledgeArticle.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Article removed' });
  } catch (error) {
    next(error);
  }
};
