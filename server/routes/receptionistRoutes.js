import { Router } from 'express';
import Guest   from '../models/Guest.js';
import Room    from '../models/Room.js';
import Booking from '../models/Booking.js';
import { protect, restrictTo }         from '../middleware/auth.js';
import { catchAsync, sendSuccess, sendError } from '../utils/helpers.js';

const router = Router();

router.use(protect, restrictTo('admin', 'receptionist'));

/* ─────────────────────────────────────────
   DASHBOARD
───────────────────────────────────────── */
router.get('/dashboard', catchAsync(async (req, res) => {
  const [activeGuests, pendingGuests, availableRooms, recentCheckouts] = await Promise.all([
    Guest.find({ status: 'active'  }).sort({ createdAt: -1 }).lean(),
    Guest.find({ status: 'pending' }).lean(),
    Room.countDocuments({ status: 'available' }),
    Guest.find({ status: 'checked-out' }).sort({ updatedAt: -1 }).limit(3).lean(),
  ]);

  sendSuccess(res, {
    activeGuests,
    pendingGuests,
    recentCheckouts,
    stats: {
      currentGuests: activeGuests.length,
      availableRooms,
      pendingAllocation: pendingGuests.length,
    },
  });
}));

/* ─────────────────────────────────────────
   GUEST TRACKING (timeline)
───────────────────────────────────────── */
router.get('/guests', catchAsync(async (req, res) => {
  const guests = await Guest.find().sort({ updatedAt: -1 }).lean();
  sendSuccess(res, { guests });
}));

/* ─────────────────────────────────────────
   ROOM ALLOCATION — assign room to pending guest
───────────────────────────────────────── */
router.post('/guests/:guestId/assign-room', catchAsync(async (req, res) => {
  const { roomId } = req.body;
  if (!roomId) return sendError(res, 'roomId is required', 400);

  const [guest, room] = await Promise.all([
    Guest.findById(req.params.guestId),
    Room.findById(roomId),
  ]);

  if (!guest) return sendError(res, 'Guest not found', 404);
  if (!room)  return sendError(res, 'Room not found', 404);
  if (guest.status !== 'pending') return sendError(res, 'Guest is not in pending state', 400);
  if (room.status  !== 'available') return sendError(res, 'Room is not available', 400);

  const checkIn = new Date().toISOString().split('T')[0];

  // Atomic updates
  await Promise.all([
    Guest.findByIdAndUpdate(guest._id, {
      roomId, roomNumber: room.number, status: 'active', checkIn,
    }),
    Room.findByIdAndUpdate(room._id, { status: 'occupied' }),
  ]);

  sendSuccess(res, { guestId: guest._id, roomNumber: room.number }, 'Room assigned');
}));

/* ─────────────────────────────────────────
   CHECK OUT
───────────────────────────────────────── */
router.post('/guests/:guestId/checkout', catchAsync(async (req, res) => {
  const guest = await Guest.findById(req.params.guestId);
  if (!guest)               return sendError(res, 'Guest not found', 404);
  if (guest.status !== 'active') return sendError(res, 'Guest is not active', 400);

  const ops = [
    Guest.findByIdAndUpdate(guest._id, {
      status: 'checked-out', roomId: null, roomNumber: null,
    }),
    Booking.updateMany(
      { guestId: guest._id, status: { $in: ['confirmed', 'active'] } },
      { status: 'completed' }
    ),
  ];

  if (guest.roomId) {
    ops.push(Room.findByIdAndUpdate(guest.roomId, { status: 'available' }));
  }

  await Promise.all(ops);
  sendSuccess(res, {}, 'Guest checked out');
}));

/* ─────────────────────────────────────────
   AVAILABLE ROOMS (for assign-room dropdown)
───────────────────────────────────────── */
router.get('/rooms/available', catchAsync(async (req, res) => {
  const rooms = await Room.find({ status: 'available' }).sort({ number: 1 }).lean();
  sendSuccess(res, { rooms });
}));

export default router;
