import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { getAuditLogs } from '../controllers/adminDataController.js';
import { seedInitialUsers } from './seedUsers.js';
import { seedAdminData } from './seedAdminData.js';
import { seedTickets } from './seedTickets.js';
import { seedAssets } from './seedAssets.js';

dotenv.config();

const runAuditLogsTest = async () => {
  try {
    console.log('[Audit Logs Test] Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/servicedesk_pro');

    await seedInitialUsers();
    await seedAdminData();
    await seedTickets();
    await seedAssets();

    console.log('[Audit Logs Test] Calling getAuditLogs controller...');
    const req = {};
    const res = {
      status: (code) => ({
        json: (data) => {
          console.log(`[Audit Logs Test] Response Code ${code}:`, data.count, 'entries returned.');
          if (data.data && data.data.length > 0) {
            console.log('[Audit Logs Test] Sample Audit Log Entry:', data.data[0]);
          }
        },
      }),
    };

    await getAuditLogs(req, res, (err) => {
      if (err) throw err;
    });

    console.log('[Audit Logs Test] AUDIT LOGS TEST PASSED CLEANLY.');
    process.exit(0);
  } catch (err) {
    console.error('[Audit Logs Test Error]', err);
    process.exit(1);
  }
};

runAuditLogsTest();
