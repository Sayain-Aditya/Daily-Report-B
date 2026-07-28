import express from 'express';
import Entry from '../models/Entry.js';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

// GET /api/firm/entries
router.get('/entries', async (req, res) => {
  if (!req.isOwner) return res.status(403).json({ error: 'Owner access only' });
  try {
    const filter = { firmId: req.firmId };
    if (req.query.userId) filter.userId = req.query.userId;
    if (req.query.date) filter.date = req.query.date;
    const entries = await Entry.find(filter).sort({ createdAt: -1 }).lean();
    res.json(entries);
  } catch {
    res.status(500).json({ error: 'Unable to load firm entries' });
  }
});

// GET /api/firm/reps
router.get('/reps', async (req, res) => {
  if (!req.isOwner) return res.status(403).json({ error: 'Owner access only' });
  try {
    const reps = await User.find({ firmId: req.firmId }, 'name isOwner createdAt').lean();
    res.json(reps);
  } catch {
    res.status(500).json({ error: 'Unable to load reps' });
  }
});

// POST /api/firm/members
router.post('/members', async (req, res) => {
  if (!req.isOwner) return res.status(403).json({ error: 'Owner access only' });
  const { name, accessCode } = req.body;
  if (!name?.trim() || !accessCode?.trim()) return res.status(400).json({ error: 'Name and access code are required' });
  const code = accessCode.trim().toUpperCase();
  if (!/^[A-Z0-9]{4,10}$/.test(code)) return res.status(400).json({ error: 'Access code must be 4-10 letters/numbers' });
  try {
    const exists = await User.findOne({ accessCode: code });
    if (exists) return res.status(409).json({ error: 'Access code already in use' });
    const user = await User.create({ name: name.trim(), firmId: req.firmId, accessCode: code, isOwner: false });
    res.json({ id: user._id, name: user.name, accessCode: user.accessCode });
  } catch {
    res.status(500).json({ error: 'Could not create member' });
  }
});

// GET /api/firm/stats
router.get('/stats', async (req, res) => {
  if (!req.isOwner) return res.status(403).json({ error: 'Owner access only' });
  try {
    const stats = await Entry.aggregate([
      { $match: { firmId: req.firmId } },
      { $group: { _id: '$userId', total: { $sum: 1 } } },
    ]);
    const users = await User.find({ firmId: req.firmId }, 'name').lean();
    const userMap = Object.fromEntries(users.map((u) => [String(u._id), u.name]));
    res.json(stats.map((s) => ({ userId: s._id, name: userMap[String(s._id)] || 'Unknown', total: s.total })));
  } catch {
    res.status(500).json({ error: 'Unable to load stats' });
  }
});

export default router;
