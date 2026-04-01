import admin from '../config/firebase.js';
import User from '../models/user.js';

/**
 * requireAuth
 * Verifies the Firebase ID token in the Authorization header.
 * Attaches { userId, role, email } to req.user on success.
 */
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = await admin.auth().verifyIdToken(token);

    // Fetch DB user so we always have the latest role
    const user = await User.findOne({ firebaseUid: decoded.uid }).select('_id role email');
    if (!user) {
      return res.status(401).json({ error: 'User not found in database. Please sync first.' });
    }

    req.user = { userId: user._id, role: user.role, email: user.email };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

/**
 * requireRole(...roles)
 * Usage: requireRole('admin')  or  requireRole('receptionist', 'admin')
 * Must be used AFTER requireAuth.
 */
export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      error: `Access denied. Required role(s): ${roles.join(', ')}. Your role: ${req.user.role}`,
    });
  }
  next();
};