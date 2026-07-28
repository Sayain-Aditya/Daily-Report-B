import Settings from '../models/Settings.js';

export async function getSettings(req, res) {
  try {
    const settings = await Settings.findOne({ userId: req.userId }).lean();
    res.json(settings || { salesOfficer: '' });
  } catch {
    res.status(500).json({ error: 'Unable to load settings' });
  }
}

export async function saveSettings(req, res) {
  try {
    const settings = await Settings.findOneAndUpdate(
      { userId: req.userId },
      { ...req.body, userId: req.userId },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json(settings);
  } catch {
    res.status(500).json({ error: 'Unable to save settings' });
  }
}
