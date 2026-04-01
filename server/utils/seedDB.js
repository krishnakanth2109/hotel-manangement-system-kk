/**
 * seedDB.js — seeds demo users + rooms
 * Works both as:
 * 1. Imported function (server.js)
 * 2. Standalone script (node seedDB.js)
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Room from '../models/Room.js';

dotenv.config();

/* ─────────────────────────────────────────────── */
/* Seed Data                                      */
/* ─────────────────────────────────────────────── */

const SEED_USERS = [
  {
    name: 'Admin User',
    email: 'admin@hotel.com',
    password: 'admin123',
    role: 'admin',
    status: 'active',
  },
  {
    name: 'Rajesh Kumar',
    email: 'rajesh@hotel.com',
    password: 'staff123',
    role: 'staff',
    department: 'Housekeeping',
    status: 'active',
  },
  {
    name: 'Priya Sharma',
    email: 'priya@hotel.com',
    password: 'recep123',
    role: 'receptionist',
    department: 'Front Desk',
    status: 'active',
  },
  {
    name: 'Guest User',
    email: 'guest@hotel.com',
    password: 'guest123',
    role: 'guest',
    status: 'active',
  },
];

const SEED_ROOMS = [
  { number: '101', type: 'Standard', floor: 1, price: 2500, capacity: 2, amenities: ['WiFi', 'AC', 'TV'], status: 'available' },
  { number: '102', type: 'Standard', floor: 1, price: 2500, capacity: 2, amenities: ['WiFi', 'AC', 'TV'], status: 'occupied' },
  { number: '103', type: 'Standard', floor: 1, price: 2500, capacity: 2, amenities: ['WiFi', 'AC', 'TV'], status: 'available' },
  { number: '201', type: 'Deluxe', floor: 2, price: 4500, capacity: 3, amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], status: 'available' },
  { number: '202', type: 'Deluxe', floor: 2, price: 4500, capacity: 3, amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], status: 'maintenance' },
  { number: '301', type: 'Suite', floor: 3, price: 8500, capacity: 4, amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi', 'Sea View'], status: 'available' },
  { number: '302', type: 'Suite', floor: 3, price: 8500, capacity: 4, amenities: ['WiFi', 'AC', 'TV', 'Jacuzzi'], status: 'available' },
  { number: '401', type: 'Presidential', floor: 4, price: 18000, capacity: 6, amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi', 'Butler', 'Private Pool'], status: 'available' },
];

/* ─────────────────────────────────────────────── */
/* Main Seed Function                             */
/* ─────────────────────────────────────────────── */

export default async function seedDatabase() {
  console.log('🌱 Seeding database...');

  try {
    // ── USERS ─────────────────────────
    for (const userData of SEED_USERS) {
      const existing = await User.findOne({ email: userData.email });

      if (existing) {
        console.log(`⏭️ User exists: ${userData.email}`);
        continue;
      }

      const user = new User(userData);
      await user.save();

      console.log(`✅ Seeded user: ${userData.email} (${userData.role})`);
    }

    // ── ROOMS ─────────────────────────
    const roomCount = await Room.countDocuments();

    if (roomCount === 0) {
      await Room.insertMany(SEED_ROOMS);
      console.log(`✅ Seeded ${SEED_ROOMS.length} rooms`);
    } else {
      console.log(`⏭️ Rooms already exist (${roomCount})`);
    }

    console.log('🎉 Seeding completed');
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
    throw err;
  }
}

/* ─────────────────────────────────────────────── */
/* Run directly (node seedDB.js)                  */
/* ─────────────────────────────────────────────── */

if (process.argv[1].includes('seedDB.js')) {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(async () => {
      console.log('✅ MongoDB connected');

      await seedDatabase();

      console.log('🚀 Done. Exiting...');
      process.exit();
    })
    .catch(err => {
      console.error('❌ MongoDB connection failed:', err.message);
      process.exit(1);
    });
}