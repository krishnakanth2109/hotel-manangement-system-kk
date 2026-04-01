import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    number:    { type: String, required: true, unique: true, trim: true },
    type:      { type: String, enum: ['Standard', 'Deluxe', 'Suite', 'Presidential'], required: true },
    floor:     { type: Number, required: true, min: 1 },
    price:     { type: Number, required: true, min: 0 },
    capacity:  { type: Number, required: true, min: 1, max: 10, default: 2 },
    amenities: { type: [String], default: ['WiFi', 'AC', 'TV'] },
    status:    { type: String, enum: ['available', 'occupied', 'maintenance'], default: 'available' },
    image:     { type: String, default: '' },
  },
  { timestamps: true }
);

// Compound index for fast type + status queries (dashboard filters)
roomSchema.index({ type: 1, status: 1 });

export default mongoose.model('Room', roomSchema);
