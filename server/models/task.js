import mongoose from 'mongoose';
const taskSchema = new mongoose.Schema({
  taskId: String,
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  roomId: String,
  type: String,
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' }
});
export default mongoose.model('Task', taskSchema);