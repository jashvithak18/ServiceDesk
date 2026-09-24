import mongoose from 'mongoose';
import dns from 'dns';

if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

export const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI;
  const localFallbackUri = 'mongodb://127.0.0.1:27017/servicedesk_pro';

  try {
    const conn = await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 5000 });
    console.log(`[Database] Connected to Primary MongoDB: ${conn.connection.host}`);
  } catch (primaryErr) {
    console.warn(`[Database Warning] Primary MongoDB connection failed (${primaryErr.message}). Falling back to local database...`);
    try {
      const conn = await mongoose.connect(localFallbackUri);
      console.log(`[Database] Connected to Local MongoDB: ${conn.connection.host}`);
    } catch (fallbackErr) {
      console.error(`[Database Error] Local fallback database connection failed: ${fallbackErr.message}`);
      process.exit(1);
    }
  }
};
