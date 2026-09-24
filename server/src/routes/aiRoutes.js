import express from 'express';
import { classifyTicketContent } from '../services/aiService.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// POST /api/ai/classify
router.post('/classify', async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title && !description) {
      res.status(400);
      throw new Error('Title or description is required for AI classification');
    }

    const classification = await classifyTicketContent(title || '', description || '');
    res.status(200).json({ success: true, data: classification });
  } catch (error) {
    next(error);
  }
});

export default router;
