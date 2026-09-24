import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Department } from '../models/Department.js';
import { TicketCategory } from '../models/TicketCategory.js';
import { Ticket } from '../models/Ticket.js';
import { TicketComment } from '../models/TicketComment.js';
import { WorkLog } from '../models/WorkLog.js';

dotenv.config();

export const seedTickets = async () => {
  try {
    const adminUser = await User.findOne({ role: 'admin' });
    const techUser = await User.findOne({ role: 'technician' });
    const managerUser = await User.findOne({ role: 'it_manager' });
    const empUser = await User.findOne({ role: 'employee' });

    if (!adminUser || !techUser || !empUser) {
      console.log('[Seed Tickets] Required seed users missing. Skipping ticket seed.');
      return;
    }

    const categories = await TicketCategory.find();
    if (categories.length === 0) return;

    const existingCount = await Ticket.countDocuments();
    if (existingCount > 0) {
      console.log(`[Seed Tickets] ${existingCount} tickets already exist. Skipping seed.`);
      return;
    }

    const itDept = await Department.findOne({ code: 'IT' });
    const devDept = await Department.findOne({ code: 'DEV' });
    const hrDept = await Department.findOne({ code: 'HR' });

    const sampleTickets = [
      {
        ticketNumber: 'INC-1001',
        title: 'MacBook Pro screen flickering and HDMI port non-responsive',
        description: 'External monitor disconnects every 5 minutes during screen share presentation. HDMI adapter tested and working on other devices.',
        requester: empUser._id,
        assignee: techUser._id,
        category: categories.find(c => c.name.includes('Hardware'))?._id || categories[0]._id,
        priority: 'high',
        status: 'in_progress',
        department: itDept?._id || null,
        responseDeadline: new Date(Date.now() - 30 * 60000), // 30 mins ago
        resolutionDeadline: new Date(Date.now() + 180 * 60000), // 3 hrs remaining
        statusHistory: [
          { fromStatus: 'none', toStatus: 'new', changedBy: empUser._id, timestamp: new Date(Date.now() - 120 * 60000) },
          { fromStatus: 'new', toStatus: 'assigned', changedBy: managerUser?._id || adminUser._id, timestamp: new Date(Date.now() - 90 * 60000) },
          { fromStatus: 'assigned', toStatus: 'in_progress', changedBy: techUser._id, timestamp: new Date(Date.now() - 45 * 60000) },
        ],
      },
      {
        ticketNumber: 'INC-1002',
        title: 'VPN authentication failing with SSL handshake timeout',
        description: 'Unable to connect to staging cluster VPN from remote home network. Receiving error code TLS_ERR_HANDSHAKE_TIMEOUT.',
        requester: empUser._id,
        assignee: techUser._id,
        category: categories.find(c => c.name.includes('IAM'))?._id || categories[0]._id,
        priority: 'critical',
        status: 'in_progress',
        department: devDept?._id || null,
        responseDeadline: new Date(Date.now() - 60 * 60000),
        resolutionDeadline: new Date(Date.now() + 45 * 60000),
        statusHistory: [
          { fromStatus: 'none', toStatus: 'new', changedBy: empUser._id, timestamp: new Date(Date.now() - 90 * 60000) },
          { fromStatus: 'new', toStatus: 'in_progress', changedBy: techUser._id, timestamp: new Date(Date.now() - 60 * 60000) },
        ],
      },
      {
        ticketNumber: 'INC-1003',
        title: 'IntelliJ IDEA SaaS License Renewal for Backend Team',
        description: 'Annual IntelliJ Ultimate developer licenses expiring next week. Need 12 seat renewals processed via Finance.',
        requester: empUser._id,
        assignee: null,
        category: categories.find(c => c.name.includes('Software'))?._id || categories[0]._id,
        priority: 'medium',
        status: 'new',
        department: itDept?._id || null,
        responseDeadline: new Date(Date.now() + 180 * 60000),
        resolutionDeadline: new Date(Date.now() + 1200 * 60000),
        statusHistory: [
          { fromStatus: 'none', toStatus: 'new', changedBy: empUser._id, timestamp: new Date(Date.now() - 15 * 60000) },
        ],
      },
      {
        ticketNumber: 'INC-1004',
        title: 'Direct deposit bank details update confirmation',
        description: 'Submitted direct deposit form for new payroll account. Need confirmation before upcoming pay period cut-off.',
        requester: empUser._id,
        assignee: managerUser?._id || adminUser._id,
        category: categories.find(c => c.name.includes('Payroll'))?._id || categories[0]._id,
        priority: 'medium',
        status: 'resolved',
        department: hrDept?._id || null,
        resolvedAt: new Date(Date.now() - 20 * 60000),
        responseDeadline: new Date(Date.now() - 300 * 60000),
        resolutionDeadline: new Date(Date.now() - 100 * 60000),
        statusHistory: [
          { fromStatus: 'none', toStatus: 'new', changedBy: empUser._id, timestamp: new Date(Date.now() - 300 * 60000) },
          { fromStatus: 'new', toStatus: 'resolved', changedBy: managerUser?._id || adminUser._id, timestamp: new Date(Date.now() - 20 * 60000) },
        ],
      },
      {
        ticketNumber: 'INC-1005',
        title: 'Production Staging Cluster Latency Spike',
        description: 'Response times degraded to >2500ms on staging API endpoints. Database connection pool saturated.',
        requester: techUser._id,
        assignee: techUser._id,
        category: categories.find(c => c.name.includes('Network'))?._id || categories[0]._id,
        priority: 'critical',
        status: 'in_progress',
        department: devDept?._id || null,
        isSlaBreached: true, // Simulated breach for dashboard SLA metrics
        responseDeadline: new Date(Date.now() - 120 * 60000),
        resolutionDeadline: new Date(Date.now() - 10 * 60000), // Breached 10 mins ago
        statusHistory: [
          { fromStatus: 'none', toStatus: 'new', changedBy: techUser._id, timestamp: new Date(Date.now() - 140 * 60000) },
          { fromStatus: 'new', toStatus: 'in_progress', changedBy: techUser._id, timestamp: new Date(Date.now() - 130 * 60000) },
        ],
      },
    ];

    for (const tData of sampleTickets) {
      const ticket = await Ticket.create(tData);

      // Add sample comment thread
      await TicketComment.create({
        ticket: ticket._id,
        author: empUser._id,
        body: 'Please let me know if you need additional diagnostic logs or screenshot attachments.',
        isInternalNote: false,
      });

      if (ticket.status !== 'new') {
        await TicketComment.create({
          ticket: ticket._id,
          author: techUser._id,
          body: 'Internal Note: Checking hardware diagnostics and system logs on device.',
          isInternalNote: true,
        });

        await WorkLog.create({
          ticket: ticket._id,
          technician: techUser._id,
          description: 'Inspected display driver configuration and ran hardware test.',
          timeSpentMinutes: 35,
        });
      }
      console.log(`[Seed Tickets] Created ticket: ${ticket.ticketNumber} (${ticket.title})`);
    }
  } catch (err) {
    console.error('[Seed Tickets Error]', err.message);
  }
};

// Run directly if invoked from CLI
if (process.argv[2] === '--run') {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/servicedesk_pro')
    .then(async () => {
      console.log('[Seed] Database connected...');
      await seedTickets();
      console.log('[Seed] Ticket seeding complete.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed Error]', err);
      process.exit(1);
    });
}
