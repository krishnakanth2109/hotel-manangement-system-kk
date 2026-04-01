import { Router } from 'express';
import User from '../models/User.js';
import { signToken, catchAsync, sendSuccess, sendError } from '../utils/helpers.js';
import { protect } from '../middleware/auth.js';

const router = Router();

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Returns: { token, user }  — client stores token in sessionStorage
 */
router.post('/login', catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, 'Email and password are required', 400);
  }

  // select('+password') overrides the schema's select:false on the password field
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

  if (!user) {
    return sendError(res, 'Invalid email or password', 401);
  }

  // comparePassword is defined on the User model (bcrypt.compare)
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return sendError(res, 'Invalid email or password', 401);
  }

  if (user.status !== 'active') {
    return sendError(res, 'Your account is inactive. Contact admin.', 403);
  }

  const token = signToken({ id: user._id, role: user.role });

  // Remove password from response object
  const userObj = user.toObject();
  delete userObj.password;

  // ✅ Response shape that AuthContext.jsx expects:
  // data.data.token  and  data.data.user
  sendSuccess(res, { token, user: userObj }, 'Login successful');
}));

/**
 * GET /api/auth/me
 * Returns the currently logged-in user (from JWT)
 */
router.get('/me', protect, catchAsync(async (req, res) => {
  sendSuccess(res, { user: req.user });
}));

/**
 * POST /api/auth/logout
 * No protect middleware — logout should always succeed.
 * Client will remove token from sessionStorage on its own.
 */
router.post('/logout', (req, res) => {
  sendSuccess(res, {}, 'Logged out successfully');
});

export default router;