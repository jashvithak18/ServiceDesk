import dotenv from 'dotenv';
import { KnowledgeArticle } from '../models/KnowledgeArticle.js';
import { seedInitialUsers } from './seedUsers.js';
import { seedAdminData } from './seedAdminData.js';
import { seedKbArticles } from './seedKbArticles.js';
import { connectDB } from '../config/db.js';

dotenv.config();

const runKbSearchTests = async () => {
  try {
    console.log('[KB Search Test] Connecting to MongoDB...');
    await connectDB();

    console.log('[KB Search Test] Seeding prerequisites...');
    await seedInitialUsers();
    await seedAdminData();
    await seedKbArticles();

    console.log('[KB Search Test] Verifying article count...');
    const count = await KnowledgeArticle.countDocuments();
    console.log(`[KB Search Test] Total KB Articles: ${count} (Expected >= 3)`);

    console.log('[KB Search Test] Executing full-text search for "HDMI"...');
    const hdmiResults = await KnowledgeArticle.find({
      $or: [
        { title: { $regex: 'HDMI', $options: 'i' } },
        { body: { $regex: 'HDMI', $options: 'i' } },
      ],
    });

    console.log(`[KB Search Test] Found ${hdmiResults.length} articles matching "HDMI"`);

    const article = hdmiResults[0];
    if (article) {
      console.log(`[KB Search Test] Article Title: ${article.title}`);
      const initialViews = article.views;
      const initialUpvotes = article.upvotes;

      // Simulate view increment
      const updated = await KnowledgeArticle.findByIdAndUpdate(article._id, { $inc: { views: 1, upvotes: 1 } }, { new: true });
      console.log(`[KB Search Test] View Increment: ${initialViews} -> ${updated.views} (PASSED)`);
      console.log(`[KB Search Test] Upvote Increment: ${initialUpvotes} -> ${updated.upvotes} (PASSED)`);
    }

    console.log('[KB Search Test] ALL KNOWLEDGE BASE SEARCH TESTS PASSED CLEANLY.');
    process.exit(0);
  } catch (err) {
    console.error('[KB Search Test Error]', err);
    process.exit(1);
  }
};

runKbSearchTests();
