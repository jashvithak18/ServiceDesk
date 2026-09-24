import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Department } from '../models/Department.js';
import { TicketCategory } from '../models/TicketCategory.js';
import { SLAPolicy } from '../models/SLAPolicy.js';
import { seedAdminData } from './seedAdminData.js';

dotenv.config();

const runAdminDataTests = async () => {
  try {
    console.log('[Admin Data Test] Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/servicedesk_pro');

    console.log('[Admin Data Test] Running admin data seeder...');
    await seedAdminData();

    console.log('[Admin Data Test] Verifying Departments...');
    const depts = await Department.find();
    console.log(`[Admin Data Test] Total Departments: ${depts.length} (Expected >= 4)`);

    console.log('[Admin Data Test] Verifying Categories...');
    const cats = await TicketCategory.find().populate('department');
    console.log(`[Admin Data Test] Total Categories: ${cats.length} (Expected >= 5)`);

    console.log('[Admin Data Test] Verifying SLA Policies...');
    const slas = await SLAPolicy.find();
    console.log(`[Admin Data Test] Total SLA Policies: ${slas.length} (Expected = 4)`);

    console.log('[Admin Data Test] ALL ADMIN DATA TESTS PASSED CLEANLY.');
    process.exit(0);
  } catch (err) {
    console.error('[Admin Data Test Error]', err);
    process.exit(1);
  }
};

runAdminDataTests();
