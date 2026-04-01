import express   from 'express';
import mongoose  from 'mongoose';
import cors      from 'cors';
import dotenv    from 'dotenv';

import authRoutes         from './routes/authRoutes.js';
import adminRoutes        from './routes/adminRoutes.js';
import receptionistRoutes from './routes/receptionistRoutes.js';
import staffRoutes        from './routes/staffRoutes.js';
import guestRoutes        from './routes/guestRoutes.js';
import { errorHandler }   from './middleware/errorHandler.js';
import seedDatabase       from './utils/seedDB.js';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

/* ─── Middleware ──────────────────────────────────────────── */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ✅ Debug logger — shows every incoming request so you can confirm routes are hit
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

/* ─── Routes ──────────────────────────────────────────────── */
app.use('/api/auth',         authRoutes);
app.use('/api/admin',        adminRoutes);
app.use('/api/receptionist', receptionistRoutes);
app.use('/api/staff',        staffRoutes);
app.use('/api/guest',        guestRoutes);

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: new Date() }));

/* ─── 404 handler ─────────────────────────────────────────── */
app.use((req, res) => {
  console.warn(`⚠️  404 — Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

/* ─── Global error handler (must be last) ─────────────────── */
app.use(errorHandler);

/* ─── DB + Server ─────────────────────────────────────────── */
mongoose
  .connect(process.env.MONGO_URL)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    try {
      await seedDatabase();
      console.log('✅ Database seeded');
    } catch (err) {
      // ✅ Don't crash if seed fails — server still starts
      console.warn('⚠️  Seed warning (non-fatal):', err.message);
    }
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📋 Routes registered:`);
      console.log(`   POST http://localhost:${PORT}/api/auth/login`);
      console.log(`   GET  http://localhost:${PORT}/api/auth/me`);
      console.log(`   GET  http://localhost:${PORT}/health`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });