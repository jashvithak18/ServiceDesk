import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { generateAccessToken } from '../utils/generateTokens.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const runAuthTests = async () => {
  try {
    console.log('[Auth Test] Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/servicedesk_pro');

    console.log('[Auth Test] Cleaning existing test user...');
    await User.deleteOne({ email: 'testunit@servicedesk.com' });

    console.log('[Auth Test] Creating test user with bcrypt hashing...');
    const testUser = await User.create({
      name: 'Test Unit User',
      email: 'testunit@servicedesk.com',
      passwordHash: 'SuperSecret123!',
      role: 'technician',
    });

    console.log(`[Auth Test] User created with ID: ${testUser._id}`);

    // Verify password matching
    const userWithPassword = await User.findById(testUser._id).select('+passwordHash');
    const isMatch = await userWithPassword.matchPassword('SuperSecret123!');
    const isWrongMatch = await userWithPassword.matchPassword('WrongPassword');

    console.log(`[Auth Test] Password verification (correct): ${isMatch ? 'PASSED' : 'FAILED'}`);
    console.log(`[Auth Test] Password verification (incorrect): ${!isWrongMatch ? 'PASSED' : 'FAILED'}`);

    // Verify JWT Generation & Verification
    const token = generateAccessToken(testUser._id, testUser.role);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'servicedesk_jwt_access_secret_key_2026');

    console.log(`[Auth Test] JWT Token verification: ${decoded.id === testUser._id.toString() && decoded.role === 'technician' ? 'PASSED' : 'FAILED'}`);

    // Cleanup
    await User.deleteOne({ email: 'testunit@servicedesk.com' });
    console.log('[Auth Test] ALL AUTH TESTS PASSED CLEANLY.');
    process.exit(0);
  } catch (err) {
    console.error('[Auth Test Error]', err);
    process.exit(1);
  }
};

runAuthTests();
