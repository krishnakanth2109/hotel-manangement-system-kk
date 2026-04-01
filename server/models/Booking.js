import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingCode: { type: String, unique: true },   // e.g. BK-1234  (auto-generated)
    guestId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Guest', required: true },
    guestName:   { type: String, required: true },
    roomId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    roomNumber:  { type: String, required: true },
    roomType:    { type: String, required: true },
    checkIn:     { type: String, required: true },   // YYYY-MM-DD
    checkOut:    { type: String, required: true },
    nights:      { type: Number, required: true, min: 1 },
    amount:      { type: Number, required: true, min: 0 },
    status:      { type: String, enum: ['confirmed', 'active', 'completed', 'cancelled'], default: 'confirmed' },
  },
  { timestamps: true }
);

// Auto-generate short booking code before first save
bookingSchema.pre('save', async function (next) {
  if (this.isNew && !this.bookingCode) {
    const suffix = String(Date.now()).slice(-5);
    this.bookingCode = `BK-${suffix}`;
  }
  next();
});

bookingSchema.index({ guestId: 1, status: 1 });
bookingSchema.index({ roomId: 1 });
bookingSchema.index({ createdAt: -1 });

export default mongoose.model('Booking', bookingSchema);
