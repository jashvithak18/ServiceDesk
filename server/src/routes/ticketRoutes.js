import express from 'express';
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicketStatus,
  assignTicket,
  reopenTicket,
  addComment,
  addWorkLog,
} from '../controllers/ticketController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createTicket)
  .get(getTickets);

router.route('/:id')
  .get(getTicketById);

router.route('/:id/status')
  .put(requireRole('admin', 'it_manager', 'technician'), updateTicketStatus);

router.route('/:id/assign')
  .put(requireRole('admin', 'it_manager', 'technician'), assignTicket);

router.route('/:id/reopen')
  .post(reopenTicket);

router.route('/:id/comments')
  .post(addComment);

router.route('/:id/worklogs')
  .post(requireRole('admin', 'it_manager', 'technician'), addWorkLog);

export default router;
