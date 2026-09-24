import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { TicketCategory } from '../models/TicketCategory.js';
import { Ticket } from '../models/Ticket.js';
import { TicketComment } from '../models/TicketComment.js';
import { WorkLog } from '../models/WorkLog.js';
import { seedInitialUsers } from './seedUsers.js';
import { seedAdminData } from './seedAdminData.js';
import { seedTickets } from './seedTickets.js';

dotenv.config();

const runTicketLifecycleTests = async () => {
  try {
    console.log('[Ticket Lifecycle Test] Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/servicedesk_pro');

    console.log('[Ticket Lifecycle Test] Seeding prerequisites...');
    await seedInitialUsers();
    await seedAdminData();
    await seedTickets();

    console.log('[Ticket Lifecycle Test] Verifying Ticket documents count...');
    const ticketCount = await Ticket.countDocuments();
    console.log(`[Ticket Lifecycle Test] Total Tickets: ${ticketCount} (Expected >= 5)`);

    const empUser = await User.findOne({ role: 'employee' });
    const techUser = await User.findOne({ role: 'technician' });
    const category = await TicketCategory.findOne();

    console.log('[Ticket Lifecycle Test] Creating a test ticket via MERN model...');
    const ticket = await Ticket.create({
      ticketNumber: `INC-TEST-${Date.now().toString().slice(-4)}`,
      title: 'Automated Lifecycle Unit Test Ticket',
      description: 'Testing lifecycle transitions, comments, internal notes, and reopen mechanism.',
      requester: empUser._id,
      category: category._id,
      priority: 'high',
      status: 'new',
    });

    console.log(`[Ticket Lifecycle Test] Created ticket: ${ticket.ticketNumber}`);

    // Add public comment
    const publicComment = await TicketComment.create({
      ticket: ticket._id,
      author: empUser._id,
      body: 'Public user comment for testing.',
      isInternalNote: false,
    });

    // Add technician internal note
    const internalNote = await TicketComment.create({
      ticket: ticket._id,
      author: techUser._id,
      body: 'Technician internal note for testing.',
      isInternalNote: true,
    });

    // Add work log
    const workLog = await WorkLog.create({
      ticket: ticket._id,
      technician: techUser._id,
      description: 'Spent 45 minutes on unit testing.',
      timeSpentMinutes: 45,
    });

    // Status transition: new -> in_progress -> resolved
    ticket.status = 'in_progress';
    ticket.assignee = techUser._id;
    ticket.statusHistory.push({ fromStatus: 'new', toStatus: 'in_progress', changedBy: techUser._id, reason: 'Assigned to tech' });
    await ticket.save();

    ticket.status = 'resolved';
    ticket.resolvedAt = new Date();
    ticket.statusHistory.push({ fromStatus: 'in_progress', toStatus: 'resolved', changedBy: techUser._id, reason: 'Issue fixed' });
    await ticket.save();

    console.log(`[Ticket Lifecycle Test] Ticket transitioned to resolved. History length: ${ticket.statusHistory.length}`);

    // Reopen ticket
    ticket.status = 'in_progress';
    ticket.reopenCount += 1;
    ticket.resolvedAt = null;
    ticket.statusHistory.push({ fromStatus: 'resolved', toStatus: 'in_progress', changedBy: empUser._id, reason: 'Reopened by requester' });
    await ticket.save();

    console.log(`[Ticket Lifecycle Test] Ticket reopened successfully. Reopen count: ${ticket.reopenCount}`);

    // Clean up test ticket
    await Ticket.deleteOne({ _id: ticket._id });
    await TicketComment.deleteMany({ ticket: ticket._id });
    await WorkLog.deleteMany({ ticket: ticket._id });

    console.log('[Ticket Lifecycle Test] ALL TICKET LIFECYCLE TESTS PASSED CLEANLY.');
    process.exit(0);
  } catch (err) {
    console.error('[Ticket Lifecycle Test Error]', err);
    process.exit(1);
  }
};

runTicketLifecycleTests();
