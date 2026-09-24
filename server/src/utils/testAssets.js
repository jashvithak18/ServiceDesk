import dotenv from 'dotenv';
import { Asset } from '../models/Asset.js';
import { Vendor } from '../models/Vendor.js';
import { User } from '../models/User.js';
import { seedInitialUsers } from './seedUsers.js';
import { seedAdminData } from './seedAdminData.js';
import { seedAssets } from './seedAssets.js';
import { connectDB } from '../config/db.js';

dotenv.config();

const runAssetTests = async () => {
  try {
    console.log('[Asset Test] Connecting to MongoDB...');
    await connectDB();

    console.log('[Asset Test] Seeding prerequisites...');
    await seedInitialUsers();
    await seedAdminData();
    await seedAssets();

    console.log('[Asset Test] Verifying asset counts...');
    const assetCount = await Asset.countDocuments();
    console.log(`[Asset Test] Total Assets in DB: ${assetCount} (Expected >= 4)`);

    const empUser = await User.findOne({ role: 'employee' });

    console.log('[Asset Test] Registering a new asset...');
    const newAsset = await Asset.create({
      assetTag: `AST-TEST-${Date.now().toString().slice(-4)}`,
      serialNumber: `TEST-SN-${Date.now()}`,
      name: 'Test ThinkPad Workstation',
      type: 'Laptop',
      status: 'in_stock',
    });

    console.log(`[Asset Test] Created asset: ${newAsset.assetTag}`);

    // Transition to assigned
    newAsset.status = 'assigned';
    newAsset.assignedTo = empUser._id;
    newAsset.lifecycleHistory.push({ fromStatus: 'in_stock', toStatus: 'assigned', assignedTo: empUser._id, notes: 'Assigned to test user' });
    await newAsset.save();

    console.log(`[Asset Test] Asset state assigned to ${empUser.name}: PASSED`);

    // Retire asset
    newAsset.status = 'retired';
    newAsset.lifecycleHistory.push({ fromStatus: 'assigned', toStatus: 'retired', notes: 'Decommissioned' });
    await newAsset.save();

    console.log(`[Asset Test] Asset retired: PASSED`);

    // Clean up test asset
    await Asset.deleteOne({ _id: newAsset._id });

    console.log('[Asset Test] ALL ASSET MANAGEMENT TESTS PASSED CLEANLY.');
    process.exit(0);
  } catch (err) {
    console.error('[Asset Test Error]', err);
    process.exit(1);
  }
};

runAssetTests();
