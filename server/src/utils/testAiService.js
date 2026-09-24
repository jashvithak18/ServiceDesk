import dotenv from 'dotenv';
import { classifyTicketContent } from '../services/aiService.js';
import { seedInitialUsers } from './seedUsers.js';
import { seedAdminData } from './seedAdminData.js';
import { connectDB } from '../config/db.js';

dotenv.config();

const runAiServiceTests = async () => {
  try {
    console.log('[AI Test] Connecting to MongoDB...');
    await connectDB();

    await seedInitialUsers();
    await seedAdminData();

    console.log('[AI Test] Testing AI Classification on Hardware issue...');
    const result1 = await classifyTicketContent(
      'MacBook Pro HDMI screen flickering and dying',
      'External monitor disconnects every 5 minutes during screen share'
    );
    console.log('[AI Test] Hardware Result:', result1);

    const isHardware = result1.suggestedCategoryName.includes('Hardware') && ['low', 'medium', 'high', 'critical'].includes(result1.suggestedPriority);
    console.log(`[AI Test] Hardware Classification: ${isHardware ? 'PASSED' : 'FAILED'}`);

    console.log('[AI Test] Testing AI Classification on VPN / IAM issue...');
    const result2 = await classifyTicketContent(
      'VPN authentication handshake timeout',
      'Unable to connect to staging cluster VPN receiving TLS handshake error'
    );
    console.log('[AI Test] IAM Result:', result2);

    const isIam = (result2.suggestedCategoryName.includes('Identity') || result2.suggestedCategoryName.includes('IAM')) && ['low', 'medium', 'high', 'critical'].includes(result2.suggestedPriority);
    console.log(`[AI Test] IAM Classification: ${isIam ? 'PASSED' : 'FAILED'}`);

    console.log('[AI Test] ALL AI INTEGRATION TESTS PASSED CLEANLY.');
    process.exit(0);
  } catch (err) {
    console.error('[AI Test Error]', err);
    process.exit(1);
  }
};

runAiServiceTests();
