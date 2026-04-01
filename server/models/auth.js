import User from '../models/User.js';
import { verifyToken, sendError } from '../utils/helpers.js';

/** Verify JWT and attach req.user */
export const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return sendError(res, 'Not authenticated', 401);
  }

  try {
    const token   = header.split(' ')[1];
    const decoded = verifyToken(token);
    const user    = await User.findById(decoded.id).select('-password');
    if (!user || user.status !== 'active') return sendError(res, 'User not found or inactive', 401);
    req.user = user;
    next();
  } catch {
    sendError(res, 'Invalid or expired token', 401);
  }
};

/** Role-based access  — usage: restrictTo('admin', 'receptionist') */
export const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return sendError(res, 'You do not have permission for this action', 403);
  }
  next();
};
