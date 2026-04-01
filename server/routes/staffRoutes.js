import { Router } from 'express';
import Room  from '../models/Room.js';
import Guest from '../models/Guest.js';
import { protect, restrictTo }         from '../middleware/auth.js';
import { catchAsync, sendSuccess }     from '../utils/helpers.js';

const router = Router();

// Staff can see rooms and guests — read only
router.use(protect, restrictTo('admin', 'receptionist', 'staff'));

/* ─────────────────────────────────────────
   DASHBOARD
───────────────────────────────────────── */
router.get('/dashboard', catchAsync(async (req, res) => {
  const [rooms, activeGuests] = await Promise.all([
    Room.find().lean(),
    Guest.find({ status: 'active' }).lean(),
  ]);

  const byType = ['Standard', 'Deluxe', 'Suite', 'Presidential'].map(type => {
    const typeRooms = rooms.filter(r => r.type === type);
    return {
      type,
      total:     typeRooms.length,
      available: typeRooms.filter(r => r.status === 'available').length,
      price:     typeRooms[0]?.price || 0,
    };
  });

  sendSuccess(res, {
    stats: {
      totalRooms:     rooms.length,
      availableRooms: rooms.filter(r => r.status === 'available').length,
      occupiedRooms:  rooms.filter(r => r.status === 'occupied').length,
      totalGuests:    activeGuests.length,
    },
    roomsByType: byType,
    activeGuests,
  });
}));

/* ─────────────────────────────────────────
   ROOMS — read only
───────────────────────────────────────── */
router.get('/rooms', catchAsync(async (req, res) => {
  const { type, status } = req.query;
  const filter = {};
  if (type   && type   !== 'all') filter.type   = type;
  if (status && status !== 'all') filter.status = status;
  const rooms = await Room.find(filter).sort({ number: 1 }).lean();
  sendSuccess(res, { rooms });
}));

export default router;
