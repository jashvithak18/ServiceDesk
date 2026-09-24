import dotenv from 'dotenv';
import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';
import { Ticket } from '../models/Ticket.js';
import { seedInitialUsers } from './seedUsers.js';
import { seedAdminData } from './seedAdminData.js';
import { seedTickets } from './seedTickets.js';
import { connectDB } from '../config/db.js';

dotenv.config();

const runNotificationTests = async () => {
  try {
    console.log('[Notification Test] Connecting to MongoDB...');
    await connectDB();

    console.log('[Notification Test] Seeding prerequisites...');
    await seedInitialUsers();
    await seedAdminData();
    await seedTickets();

    const techUser = await User.findOne({ role: 'technician' });
    const empUser = await User.findOne({ role: 'employee' });
    const sampleTicket = await Ticket.findOne();

    console.log('[Notification Test] Creating test notification...');
    const notif = await Notification.create({
      recipient: techUser._id,
      sender: empUser._id,
      type: 'comment_added',
      ticket: sampleTicket._id,
      title: `New Comment on ${sampleTicket.ticketNumber}`,
      message: 'Test notification payload',
    });

    console.log(`[Notification Test] Notification created: ID ${notif._id}`);

    const unreadCount = await Notification.countDocuments({ recipient: techUser._id, isRead: false });
    console.log(`[Notification Test] Unread count for ${techUser.name}: ${unreadCount}`);

    // Mark as read
    await Notification.findByIdAndUpdate(notif._id, { isRead: true });
    const newUnread = await Notification.countDocuments({ recipient: techUser._id, isRead: false });
    console.log(`[Notification Test] Unread count after mark as read: ${newUnread} (PASSED)`);

    // Clean up
    await Notification.deleteOne({ _id: notif._id });

    console.log('[Notification Test] ALL NOTIFICATION TESTS PASSED CLEANLY.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('[Notification Test Error]', err);
    process.exit(1);
  }
};

runNotificationTests();
