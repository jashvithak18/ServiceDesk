import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import { seedInitialUsers } from './seedUsers.js';
import { seedAdminData } from './seedAdminData.js';
import { seedTickets } from './seedTickets.js';
import { seedAssets } from './seedAssets.js';
import { seedKbArticles } from './seedKbArticles.js';

dotenv.config();

// Ensure DNS IPv4 first ordering and set public DNS resolvers if local DNS blocks SRV lookups
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Use default if setServers is restricted
}

const testAtlasConnection = async () => {
  try {
    console.log('[Atlas Test] Connecting to MongoDB Atlas cluster...');
    console.log('[Atlas Test] URI:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('[Atlas Test] Connected successfully to Atlas!');

    console.log('[Atlas Test] Seeding database collections on Atlas...');
    await seedInitialUsers();
    await seedAdminData();
    await seedTickets();
    await seedAssets();
    await seedKbArticles();

    console.log('[Atlas Test] Seeding complete! Closing connection...');
    await mongoose.disconnect();
    console.log('[Atlas Test] All systems operational with MongoDB Atlas.');
    process.exit(0);
  } catch (err) {
    console.error('[Atlas Test Error]', err.message);
    process.exit(1);
  }
};

testAtlasConnection();
