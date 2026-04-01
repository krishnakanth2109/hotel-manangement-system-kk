import { Router } from 'express';
import User    from '../models/User.js';
import Room    from '../models/Room.js';
import Guest   from '../models/Guest.js';
import Booking from '../models/Booking.js';
import { protect, restrictTo }         from '../middleware/auth.js';
import { catchAsync, sendSuccess, sendError } from '../utils/helpers.js';

const router = Router();

// All admin routes require authentication + admin role
router.use(protect, restrictTo('admin'));

/* ─────────────────────────────────────────
   DASHBOARD STATS
───────────────────────────────────────── */
router.get('/stats', catchAsync(async (req, res) => {
  const [rooms, guests, staff, bookings] = await Promise.all([
    Room.find().lean(),
    Guest.find().lean(),
    User.find({ role: { $in: ['staff', 'receptionist'] } }).lean(),
    Booking.find().lean(),
  ]);

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);

  sendSuccess(res, {
    totalRooms:       rooms.length,
    availableRooms:   rooms.filter(r => r.status === 'available').length,
    occupiedRooms:    rooms.filter(r => r.status === 'occupied').length,
    maintenanceRooms: rooms.filter(r => r.status === 'maintenance').length,
    totalGuests:      guests.filter(g => g.status === 'active').length,
    totalStaff:       staff.length,
    totalBookings:    bookings.length,
    totalRevenue,
  });
}));

/* ─────────────────────────────────────────
   STAFF MANAGEMENT
───────────────────────────────────────── */

// GET /api/admin/staff
router.get('/staff', catchAsync(async (req, res) => {
  const { role, search } = req.query;
  const filter = { role: { $in: ['staff', 'receptionist'] } };
  if (role && role !== 'all') filter.role = role;
  if (search) filter.$or = [
    { name:  { $regex: search, $options: 'i' } },
    { email: { $regex: search, $options: 'i' } },
  ];
  const staff = await User.find(filter).sort({ createdAt: -1 }).lean();
  sendSuccess(res, { staff });
}));

// POST /api/admin/staff
router.post('/staff', catchAsync(async (req, res) => {
  const { name, email, phone, role, department, salary, joinDate } = req.body;

  if (!['staff', 'receptionist'].includes(role)) {
    return sendError(res, 'Role must be staff or receptionist', 400);
  }

  const member = await User.create({
    name, email, phone, role, department,
    salary, joinDate: joinDate || new Date().toISOString().split('T')[0],
    password: 'staff123',   // default password — they should change it
    status: 'active',
  });

  sendSuccess(res, { member }, 'Staff member added', 201);
}));

// PATCH /api/admin/staff/:id
router.patch('/staff/:id', catchAsync(async (req, res) => {
  const allowed = ['name', 'phone', 'department', 'salary', 'status', 'role'];
  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([k]) => allowed.includes(k))
  );

  const member = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!member) return sendError(res, 'Staff member not found', 404);
  sendSuccess(res, { member }, 'Staff member updated');
}));

// DELETE /api/admin/staff/:id
router.delete('/staff/:id', catchAsync(async (req, res) => {
  const member = await User.findByIdAndDelete(req.params.id);
  if (!member) return sendError(res, 'Staff member not found', 404);
  sendSuccess(res, {}, 'Staff member removed');
}));

/* ─────────────────────────────────────────
   ROOM MANAGEMENT
───────────────────────────────────────── */

// GET /api/admin/rooms
router.get('/rooms', catchAsync(async (req, res) => {
  const { type, status, search } = req.query;
  const filter = {};
  if (type   && type   !== 'all') filter.type   = type;
  if (status && status !== 'all') filter.status = status;
  if (search) filter.$or = [
    { number: { $regex: search, $options: 'i' } },
    { type:   { $regex: search, $options: 'i' } },
  ];
  const rooms = await Room.find(filter).sort({ number: 1 }).lean();
  sendSuccess(res, { rooms });
}));

// POST /api/admin/rooms
router.post('/rooms', catchAsync(async (req, res) => {
  const room = await Room.create(req.body);
  sendSuccess(res, { room }, 'Room added', 201);
}));

// PATCH /api/admin/rooms/:id/status
router.patch('/rooms/:id/status', catchAsync(async (req, res) => {
  const { status } = req.body;
  if (!['available', 'occupied', 'maintenance'].includes(status)) {
    return sendError(res, 'Invalid status', 400);
  }
  const room = await Room.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!room) return sendError(res, 'Room not found', 404);
  sendSuccess(res, { room }, 'Room status updated');
}));

// PATCH /api/admin/rooms/:id  — general update
router.patch('/rooms/:id', catchAsync(async (req, res) => {
  const allowed = ['type', 'floor', 'price', 'capacity', 'amenities', 'status', 'image'];
  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([k]) => allowed.includes(k))
  );
  const room = await Room.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!room) return sendError(res, 'Room not found', 404);
  sendSuccess(res, { room }, 'Room updated');
}));

// DELETE /api/admin/rooms/:id
router.delete('/rooms/:id', catchAsync(async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) return sendError(res, 'Room not found', 404);
  if (room.status === 'occupied') return sendError(res, 'Cannot delete an occupied room', 400);
  await room.deleteOne();
  sendSuccess(res, {}, 'Room deleted');
}));

/* ─────────────────────────────────────────
   GUEST MANAGEMENT
───────────────────────────────────────── */

// GET /api/admin/guests
router.get('/guests', catchAsync(async (req, res) => {
  const { status, search } = req.query;
  const filter = {};
  if (status && status !== 'all') filter.status = status;
  if (search) filter.$or = [
    { name:  { $regex: search, $options: 'i' } },
    { email: { $regex: search, $options: 'i' } },
  ];
  const guests = await Guest.find(filter).sort({ createdAt: -1 }).lean();
  sendSuccess(res, { guests });
}));

/* ─────────────────────────────────────────
   BOOKINGS
───────────────────────────────────────── */

// GET /api/admin/bookings
router.get('/bookings', catchAsync(async (req, res) => {
  const { status, search } = req.query;
  const filter = {};
  if (status && status !== 'all') filter.status = status;
  if (search) filter.$or = [
    { guestName:   { $regex: search, $options: 'i' } },
    { bookingCode: { $regex: search, $options: 'i' } },
  ];
  const bookings = await Booking.find(filter).sort({ createdAt: -1 }).lean();
  sendSuccess(res, { bookings });
}));

// GET /api/admin/bookings/recent  — last 5 for dashboard widget
router.get('/bookings/recent', catchAsync(async (req, res) => {
  const bookings = await Booking.find().sort({ createdAt: -1 }).limit(5).lean();
  sendSuccess(res, { bookings });
}));

export default router;
