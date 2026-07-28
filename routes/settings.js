import express from 'express';
import Settings from '../models/Settings.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const settings = await Settings.findOne({ userId: req.userId });
    res.json(settings || { salesOfficer: '' });
  } catch {
    res.status(500).json({ error: 'Unable to load settings' });
  }
});

router.post('/', async (req, res) => {
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
});

export default router;
