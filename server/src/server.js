import dotenv from 'dotenv';
import dns from 'dns';
import app from './app.js';
import { connectDB } from './config/db.js';
import { seedInitialUsers } from './utils/seedUsers.js';
import { seedAdminData } from './utils/seedAdminData.js';
import { seedTickets } from './utils/seedTickets.js';
import { seedAssets } from './utils/seedAssets.js';
import { seedKbArticles } from './utils/seedKbArticles.js';
import { initSlaCron } from './services/slaService.js';

dotenv.config();

// Ensure Node.js resolves IPv4 first
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const PORT = process.env.PORT || 5000;

// Connect to MongoDB, seed data, start SLA cron, and start server
connectDB().then(async () => {
  await seedInitialUsers();
  await seedAdminData();
  await seedTickets();
  await seedAssets();
  await seedKbArticles();

  // Launch background SLA monitoring worker
  initSlaCron();

  app.listen(PORT, () => {
    console.log(`[ServiceDesk Pro] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}).catch((err) => {
  console.error('[ServiceDesk Pro] Failed to start server:', err);
});
