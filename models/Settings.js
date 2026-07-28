import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  userId: { type: String, index: true },
  salesOfficer: String,
}, { collection: 'daily_report_settings' });

export default mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
