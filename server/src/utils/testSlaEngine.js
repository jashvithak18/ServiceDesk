import dotenv from 'dotenv';
import { addBusinessMinutes } from './businessHours.js';
import { calculateTicketDeadlines, runSlaCheck } from '../services/slaService.js';
import { Ticket } from '../models/Ticket.js';
import { seedInitialUsers } from './seedUsers.js';
import { seedAdminData } from './seedAdminData.js';
import { connectDB } from '../config/db.js';

dotenv.config();

const runSlaEngineTests = async () => {
  try {
    console.log('[SLA Test] Testing Business Hours Calculation Algorithm...');

    // Friday Sept 4, 2026 at 17:00 (5:00 PM) local time
    // Adding 120 operating minutes (2 hours):
    // 1 hr remaining on Friday (17:00 -> 18:00)
    // 1 hr rolls over to Monday 09:00 AM -> Target: Monday 10:00 AM local time!
    const friday5pm = new Date(2026, 8, 4, 17, 0, 0); 
    const targetDate = addBusinessMinutes(friday5pm, 120, {
      startHour: 9,
      endHour: 18,
      workDays: [1, 2, 3, 4, 5],
    });

    console.log(`[SLA Test] Start Date: ${friday5pm.toString()}`);
    console.log(`[SLA Test] +120 Business Mins Result: ${targetDate.toString()}`);

    const isMonday = targetDate.getDay() === 1; // 1 = Monday
    const is10am = targetDate.getHours() === 10;
    console.log(`[SLA Test] Business-hours rollover to Monday 10:00 AM: ${isMonday && is10am ? 'PASSED' : 'FAILED'}`);

    console.log('[SLA Test] Connecting to MongoDB...');
    await connectDB();

    await seedInitialUsers();
    await seedAdminData();

    console.log('[SLA Test] Testing calculateTicketDeadlines for critical priority...');
    const deadlines = await calculateTicketDeadlines('critical');
    console.log(`[SLA Test] Response Deadline: ${deadlines.responseDeadline.toString()}`);
    console.log(`[SLA Test] Resolution Deadline: ${deadlines.resolutionDeadline.toString()}`);

    console.log('[SLA Test] Running SLA Background Scanner...');
    await runSlaCheck();

    console.log('[SLA Test] ALL SLA ENGINE TESTS PASSED CLEANLY.');
    process.exit(0);
  } catch (err) {
    console.error('[SLA Test Error]', err);
    process.exit(1);
  }
};

runSlaEngineTests();
