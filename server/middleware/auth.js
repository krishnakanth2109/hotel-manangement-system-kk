/**
 * middleware/auth.js
 * Pure JWT authentication — no Firebase, no external deps beyond jsonwebtoken.
 * Token is sent by client in:  Authorization: Bearer <token>
 * Token is stored by client in: sessionStorage  (set in AuthContext.jsx)
 */
import User from '../models/User.js';
import { verifyToken, sendError } from '../utils/helpers.js';

/**
 * protect — verifies JWT and attaches req.user
 * Use on any route that requires a logged-in user.
 */
export const protect = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return sendError(res, 'Not authenticated — no token provided', 401);
  }

  try {
    const token   = header.split(' ')[1];
    const decoded = verifyToken(token);               // throws if invalid/expired

    const user = await User.findById(decoded.id).select('-password');
    if (!user) return sendError(res, 'User not found', 401);
    if (user.status !== 'active') return sendError(res, 'Account inactive', 401);

    req.user = user;   // ✅ available as req.user in all downstream routes
    next();
  } catch (err) {
    return sendError(res, 'Invalid or expired token', 401);
  }
};

/**
 * restrictTo(...roles) — role-based access control
 * Must be used AFTER protect.
 * Usage: router.use(protect, restrictTo('admin'))
 */
export const restrictTo = (...roles) => (req, res, next) => {
  if (!req.user) return sendError(res, 'Not authenticated', 401);
  if (!roles.includes(req.user.role)) {
    return sendError(res, `Access denied. Required: ${roles.join(', ')}. Your role: ${req.user.role}`, 403);
  }
  next();
};