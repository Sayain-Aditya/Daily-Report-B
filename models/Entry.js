import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  firmId: { type: String, required: true, index: true },
  date: String,
  firmName: String,
  owner: String,
  phone: String,
  designation: String,
  clientStatus: String,
  meetingPlace: String,
  location: String,
  remarks: String,
  createdAt: Number,
}, { timestamps: true });

export default mongoose.models.Entry || mongoose.model('Entry', entrySchema);
