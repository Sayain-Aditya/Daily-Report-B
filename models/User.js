import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  firmId: { type: String, required: true },
  accessCode: { type: String, required: true },   // stored as plain (hashed in setup, compared on recover)
  isOwner: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);
