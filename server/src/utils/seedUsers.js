import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../models/User.js';

dotenv.config();

const demoUsers = [
  {
    name: 'Alex Miller (Admin)',
    email: 'admin@servicedesk.com',
    passwordHash: 'Admin123!',
    role: 'admin',
    avatarColor: '#B5502F',
  },
  {
    name: 'Sarah Connor (IT Lead)',
    email: 'manager@servicedesk.com',
    passwordHash: 'Manager123!',
    role: 'it_manager',
    avatarColor: '#3E5C76',
  },
  {
    name: 'Marcus Vance (Senior Tech)',
    email: 'tech@servicedesk.com',
    passwordHash: 'Tech123!',
    role: 'technician',
    avatarColor: '#3D6B4F',
  },
  {
    name: 'Elena Rostova (Asset Manager)',
    email: 'asset@servicedesk.com',
    passwordHash: 'Asset123!',
    role: 'asset_manager',
    avatarColor: '#B5822F',
  },
  {
    name: 'David Kim (Finance Specialist)',
    email: 'employee@servicedesk.com',
    passwordHash: 'Employee123!',
    role: 'employee',
    avatarColor: '#5E4B8B',
  },
];

export const seedInitialUsers = async () => {
  try {
    for (const u of demoUsers) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        await User.create(u);
        console.log(`[Seed] Created demo user: ${u.email} (${u.role})`);
      }
    }
  } catch (err) {
    console.error('[Seed Error]', err.message);
  }
};

// Run directly if invoked from CLI
if (process.argv[2] === '--run') {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/servicedesk_pro')
    .then(async () => {
      console.log('[Seed] Database connected...');
      await seedInitialUsers();
      console.log('[Seed] User seeding complete.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed Error]', err);
      process.exit(1);
    });
}
