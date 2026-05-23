import mongoose, { Schema } from 'mongoose';

const taskSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: String,
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  status: { type: String, enum: ['todo', 'progress', 'done'], default: 'todo' },
  deadline: Date,
  progress: { type: Number, min: 0, max: 100, default: 0 },
  category: { type: String, default: 'General' },
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);
