import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name:       { type: String, required: true, trim: true },
    email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:   { type: String, required: true, select: false }, // never returned by default
    role:       { type: String, enum: ['admin', 'staff', 'receptionist', 'guest'], required: true },
    phone:      { type: String, default: '' },
    department: { type: String, default: '' },
    salary:     { type: Number, default: 0 },
    joinDate:   { type: String, default: () => new Date().toISOString().split('T')[0] },
    status:     { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

// ✅ Hash password before every save (new user OR password change)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ✅ Instance method used in login route
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Prevent OverwriteModelError on hot-reload
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;