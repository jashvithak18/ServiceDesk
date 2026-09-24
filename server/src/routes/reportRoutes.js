import express from 'express';
import {
  getDashboardAnalytics,
  exportTicketsCSV,
  exportAssetsCSV,
  exportSlaReportPDF,
} from '../controllers/reportController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/analytics', requireRole('admin', 'it_manager'), getDashboardAnalytics);
router.get('/tickets/csv', exportTicketsCSV);
router.get('/assets/csv', exportAssetsCSV);
router.get('/pdf', requireRole('admin', 'it_manager'), exportSlaReportPDF);

export default router;
