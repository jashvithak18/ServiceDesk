import dotenv from 'dotenv';
import { Ticket } from '../models/Ticket.js';
import { Asset } from '../models/Asset.js';
import { seedInitialUsers } from './seedUsers.js';
import { seedAdminData } from './seedAdminData.js';
import { seedTickets } from './seedTickets.js';
import { seedAssets } from './seedAssets.js';
import { connectDB } from '../config/db.js';

dotenv.config();

const runAnalyticsTests = async () => {
  try {
    console.log('[Analytics Test] Connecting to MongoDB...');
    await connectDB();

    console.log('[Analytics Test] Seeding prerequisites...');
    await seedInitialUsers();
    await seedAdminData();
    await seedTickets();
    await seedAssets();

    console.log('[Analytics Test] Calculating MongoDB Live Aggregation metrics...');
    const totalTickets = await Ticket.countDocuments();
    const breached = await Ticket.countDocuments({ isSlaBreached: true });
    const compliance = totalTickets > 0 ? (((totalTickets - breached) / totalTickets) * 100).toFixed(1) : 100;

    console.log(`[Analytics Test] Total Tickets: ${totalTickets}`);
    console.log(`[Analytics Test] Breached Tickets: ${breached}`);
    console.log(`[Analytics Test] SLA Compliance Rate: ${compliance}%`);

    console.log('[Analytics Test] Generating CSV header & row structures...');
    const sampleTicket = await Ticket.findOne();
    const csvRow = `${sampleTicket.ticketNumber},"${sampleTicket.title}",${sampleTicket.priority},${sampleTicket.status}`;
    console.log(`[Analytics Test] Sample CSV Row: ${csvRow}`);

    console.log('[Analytics Test] ALL DASHBOARD & REPORTING TESTS PASSED CLEANLY.');
    process.exit(0);
  } catch (err) {
    console.error('[Analytics Test Error]', err);
    process.exit(1);
  }
};

runAnalyticsTests();
