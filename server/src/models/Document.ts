import mongoose, { Schema } from 'mongoose';

const documentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  filename: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  chunkCount: { type: Number, default: 0 },
  summary: String,
  status: { type: String, enum: ['processing', 'ready', 'failed'], default: 'processing' },
}, { timestamps: true });

export default mongoose.model('Document', documentSchema);
