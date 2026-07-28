import mongoose from 'mongoose';

const firmSchema = new mongoose.Schema({
  name: { type: String, required: true },
  inviteCode: { type: String, required: true, unique: true },
}, { timestamps: true });

export default mongoose.models.Firm || mongoose.model('Firm', firmSchema);
