import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Vendor } from '../models/Vendor.js';
import { Asset } from '../models/Asset.js';
import { User } from '../models/User.js';
import { Department } from '../models/Department.js';

dotenv.config();

export const seedAssets = async () => {
  try {
    const existingVendors = await Vendor.countDocuments();
    let vendorApple, vendorDell, vendorLenovo;

    if (existingVendors === 0) {
      vendorApple = await Vendor.create({ name: 'Apple Inc. Direct', contactPerson: 'Mark Vance', email: 'b2b@apple.com', phone: '+1-800-MY-APPLE', website: 'https://apple.com' });
      vendorDell = await Vendor.create({ name: 'Dell Enterprise Solutions', contactPerson: 'Sarah Jenkins', email: 'sales@dell.com', phone: '+1-800-456-3355', website: 'https://dell.com' });
      vendorLenovo = await Vendor.create({ name: 'Lenovo Global B2B', contactPerson: 'Kenji Sato', email: 'enterprise@lenovo.com', phone: '+1-855-253-6686', website: 'https://lenovo.com' });
      console.log('[Seed Assets] Vendors created.');
    } else {
      vendorApple = await Vendor.findOne({ name: 'Apple Inc. Direct' });
      vendorDell = await Vendor.findOne({ name: 'Dell Enterprise Solutions' });
      vendorLenovo = await Vendor.findOne({ name: 'Lenovo Global B2B' });
    }

    const countAssets = await Asset.countDocuments();
    if (countAssets > 0) {
      console.log(`[Seed Assets] ${countAssets} assets already exist. Skipping asset seed.`);
      return;
    }

    const empUser = await User.findOne({ role: 'employee' });
    const techUser = await User.findOne({ role: 'technician' });
    const itDept = await Department.findOne({ code: 'IT' });

    const now = new Date();
    const expiringSoonWarranty = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000); // Expires in 15 days
    const activeWarranty = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // Expires in 1 year

    const sampleAssets = [
      {
        assetTag: 'AST-4001',
        serialNumber: 'C02G1829MD6R',
        name: 'MacBook Pro 16" M3 Max (36GB RAM / 1TB SSD)',
        type: 'Laptop',
        vendor: vendorApple?._id,
        purchaseDate: new Date('2024-03-15'),
        purchaseCost: 3499,
        warrantyExpiry: expiringSoonWarranty, // Expiring soon warning!
        status: 'assigned',
        assignedTo: empUser?._id,
        department: itDept?._id,
        lifecycleHistory: [
          { fromStatus: 'none', toStatus: 'in_stock', changedBy: techUser?._id, notes: 'Procured and unboxed' },
          { fromStatus: 'in_stock', toStatus: 'assigned', assignedTo: empUser?._id, changedBy: techUser?._id, notes: 'Issued to employee for remote work' },
        ],
      },
      {
        assetTag: 'AST-4002',
        serialNumber: 'CN0981293819',
        name: 'Dell UltraSharp U2723QE 27" 4K USB-C Monitor',
        type: 'Monitor',
        vendor: vendorDell?._id,
        purchaseDate: new Date('2024-01-10'),
        purchaseCost: 620,
        warrantyExpiry: activeWarranty,
        status: 'assigned',
        assignedTo: empUser?._id,
        department: itDept?._id,
        lifecycleHistory: [
          { fromStatus: 'none', toStatus: 'assigned', assignedTo: empUser?._id, changedBy: techUser?._id, notes: 'Assigned alongside workstation' },
        ],
      },
      {
        assetTag: 'AST-4003',
        serialNumber: 'PF91028392',
        name: 'ThinkPad P1 Gen 6 Workstation Laptop',
        type: 'Laptop',
        vendor: vendorLenovo?._id,
        purchaseDate: new Date('2024-06-01'),
        purchaseCost: 2850,
        warrantyExpiry: activeWarranty,
        status: 'in_stock',
        assignedTo: null,
        department: itDept?._id,
        lifecycleHistory: [
          { fromStatus: 'none', toStatus: 'in_stock', changedBy: techUser?._id, notes: 'Available in IT storage shelf B4' },
        ],
      },
      {
        assetTag: 'AST-4004',
        serialNumber: 'FCW2301L0AB',
        name: 'Cisco Catalyst 9300 48-Port PoE+ Switch',
        type: 'Server',
        vendor: null,
        purchaseDate: new Date('2023-11-20'),
        purchaseCost: 4800,
        warrantyExpiry: activeWarranty,
        status: 'in_repair',
        assignedTo: null,
        department: itDept?._id,
        lifecycleHistory: [
          { fromStatus: 'in_stock', toStatus: 'in_repair', changedBy: techUser?._id, notes: 'Sent to Cisco RMA for power supply replacement' },
        ],
      },
    ];

    for (const a of sampleAssets) {
      await Asset.create(a);
      console.log(`[Seed Assets] Created asset: ${a.assetTag} (${a.name})`);
    }
  } catch (err) {
    console.error('[Seed Assets Error]', err.message);
  }
};

// Run directly if invoked from CLI
if (process.argv[2] === '--run') {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/servicedesk_pro')
    .then(async () => {
      console.log('[Seed] Database connected...');
      await seedAssets();
      console.log('[Seed] Asset seeding complete.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed Error]', err);
      process.exit(1);
    });
}
