import { Router } from 'express';
import Room    from '../models/Room.js';
import Guest   from '../models/Guest.js';
import Booking from '../models/Booking.js';
import { protect, restrictTo }         from '../middleware/auth.js';
import { catchAsync, sendSuccess, sendError } from '../utils/helpers.js';

const router = Router();

router.use(protect, restrictTo('admin', 'receptionist', 'staff', 'guest'));

/* ─────────────────────────────────────────
   DASHBOARD — available room summary
───────────────────────────────────────── */
router.get('/dashboard', catchAsync(async (req, res) => {
  const rooms = await Room.find().lean();

  const byType = ['Standard', 'Deluxe', 'Suite', 'Presidential'].map(type => {
    const typeRooms = rooms.filter(r => r.type === type);
    return {
      type,
      available: typeRooms.filter(r => r.status === 'available').length,
      price:     typeRooms[0]?.price || 0,
    };
  });

  sendSuccess(res, {
    stats: {
      availableRooms: rooms.filter(r => r.status === 'available').length,
      totalRooms:     rooms.length,
    },
    roomsByType: byType,
  });
}));

/* ─────────────────────────────────────────
   BROWSE AVAILABLE ROOMS
───────────────────────────────────────── */
router.get('/rooms', catchAsync(async (req, res) => {
  const { type } = req.query;
  const filter = { status: 'available' };
  if (type && type !== 'all') filter.type = type;
  const rooms = await Room.find(filter).sort({ type: 1, price: 1 }).lean();
  sendSuccess(res, { rooms });
}));

/* ─────────────────────────────────────────
   CREATE BOOKING
───────────────────────────────────────── */
router.post('/bookings', catchAsync(async (req, res) => {
  const { roomId, checkIn, checkOut, nights } = req.body;

  if (!roomId || !checkIn || !checkOut || !nights) {
    return sendError(res, 'roomId, checkIn, checkOut, nights are required', 400);
  }
  if (new Date(checkOut) <= new Date(checkIn)) {
    return sendError(res, 'Check-out must be after check-in', 400);
  }

  const room = await Room.findById(roomId);
  if (!room) return sendError(res, 'Room not found', 404);
  if (room.status !== 'available') return sendError(res, 'Room is no longer available', 400);

  const amount = nights * room.price;

  // Find or create the guest record for this user
  let guest = await Guest.findOne({ userId: req.user._id });
  if (!guest) {
    guest = await Guest.create({
      userId:  req.user._id,
      name:    req.user.name,
      email:   req.user.email,
      phone:   req.user.phone || '',
      checkIn,
      checkOut,
      status: 'pending',
      totalAmount: amount,
    });
  }

  // Booking + mark room occupied — run concurrently
  const [booking] = await Promise.all([
    Booking.create({
      guestId:    guest._id,
      guestName:  req.user.name,
      roomId:     room._id,
      roomNumber: room.number,
      roomType:   room.type,
      checkIn,
      checkOut,
      nights,
      amount,
    }),
    Room.findByIdAndUpdate(room._id, { status: 'occupied' }),
  ]);

  sendSuccess(res, { booking }, 'Booking confirmed', 201);
}));

/* ─────────────────────────────────────────
   MY BOOKINGS
───────────────────────────────────────── */
router.get('/bookings', catchAsync(async (req, res) => {
  // Find guest record for this logged-in user
  const guest = await Guest.findOne({ userId: req.user._id });
  if (!guest) return sendSuccess(res, { bookings: [] });

  const bookings = await Booking.find({ guestId: guest._id })
    .sort({ createdAt: -1 })
    .lean();

  sendSuccess(res, { bookings });
}));

export default router;
