import jwt from 'jsonwebtoken';

/* ── JWT ──────────────────────────────────────────────────── */
export const signToken = (payload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET missing from .env');
  }
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const verifyToken = (token) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET missing from .env');
  }
  return jwt.verify(token, process.env.JWT_SECRET);
};

/* ── Async route wrapper ───────────────────────────────────── */
export const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/* ── Unified response helpers ─────────────────────────────── */
export const sendSuccess = (res, data = {}, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({ success: true, message, data });
};

export const sendError = (res, message = 'Error', statusCode = 400) => {
  res.status(statusCode).json({ success: false, message });
};