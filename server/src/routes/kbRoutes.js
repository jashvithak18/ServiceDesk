import express from 'express';
import {
  getArticles,
  getArticleById,
  createArticle,
  upvoteArticle,
  deleteArticle,
} from '../controllers/kbController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getArticles)
  .post(requireRole('admin', 'it_manager', 'technician'), createArticle);

router.route('/:id')
  .get(getArticleById)
  .delete(requireRole('admin', 'it_manager'), deleteArticle);

router.route('/:id/upvote')
  .post(upvoteArticle);

export default router;
