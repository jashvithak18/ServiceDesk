import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import { classifyTicketContent } from '../services/aiService.js';
import { seedInitialUsers } from './seedUsers.js';
import { seedAdminData } from './seedAdminData.js';

dotenv.config();

const testGroq = async () => {
  try {
    console.log('[Groq AI Test] Connecting to MongoDB...');
    await connectDB();

    await seedInitialUsers();
    await seedAdminData();

    console.log('[Groq AI Test] Sending ticket classification request to Groq API (Llama-3.3-70b-versatile)...');
    const result = await classifyTicketContent(
      'VPN connection error TLS handshake timeout',
      'Unable to connect to staging cluster WireGuard VPN receiving TLS handshake timeout error on port 4500.'
    );

    console.log('[Groq AI Test] Result:', JSON.stringify(result, null, 2));

    if (!result.isAiFallback) {
      console.log(`[Groq AI Test] SUCCESS! Groq Model '${result.aiModel}' classified ticket live!`);
    } else {
      console.log('[Groq AI Test] Note: Used fallback classifier.');
    }

    process.exit(0);
  } catch (err) {
    console.error('[Groq AI Test Error]', err);
    process.exit(1);
  }
};

testGroq();
