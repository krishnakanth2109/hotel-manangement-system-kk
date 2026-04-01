import mongoose from 'mongoose';

const guestSchema = new mongoose.Schema(
  {
    // Link to User account (optional — walk-in guests may not have one)
    userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    name:        { type: String, required: true, trim: true },
    email:       { type: String, required: true, lowercase: true, trim: true },
    phone:       { type: String, required: true, trim: true },

    // Current room assignment
    roomId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Room', default: null },
    roomNumber:  { type: String, default: null },

    checkIn:     { type: String, default: null },   // YYYY-MM-DD
    checkOut:    { type: String, default: null },   // YYYY-MM-DD

    status:      { type: String, enum: ['pending', 'active', 'checked-out'], default: 'pending' },
    totalAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

guestSchema.index({ status: 1 });
guestSchema.index({ email: 1 });

export default mongoose.model('Guest', guestSchema);
