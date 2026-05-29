import mongoose, { Schema } from 'mongoose';

const documentChunkSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  document: { type: Schema.Types.ObjectId, ref: 'Document', required: true, index: true },
  filename: { type: String, required: true },
  content: { type: String, required: true },
  embedding: { type: [Number], required: true },
  chunkIndex: { type: Number, required: true },
  metadata: {
    source: String,
  },
}, { timestamps: true });

documentChunkSchema.index({ user: 1, document: 1, chunkIndex: 1 });

export default mongoose.model('DocumentChunk', documentChunkSchema);
