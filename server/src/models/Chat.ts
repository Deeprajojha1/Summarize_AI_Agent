import mongoose, { Schema } from 'mongoose';

const chatSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  toolsUsed: [String],
}, { timestamps: true });

export default mongoose.model('Chat', chatSchema);
