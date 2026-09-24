import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import assetRoutes from './routes/assetRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import kbRoutes from './routes/kbRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/inventory', assetRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/kb', kbRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = { 0: 'Disconnected', 1: 'Connected', 2: 'Connecting', 3: 'Disconnecting' };
  
  res.status(200).json({
    status: 'ok',
    service: 'ServiceDesk Pro API',
    timestamp: new Date().toISOString(),
    database: {
      status: states[dbState] || 'Unknown',
      connected: dbState === 1,
    },
  });
});

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404);
  const error = new Error(`Resource not found - ${req.originalUrl}`);
  next(error);
});

// Global Error Handler
app.use(errorHandler);

export default app;
