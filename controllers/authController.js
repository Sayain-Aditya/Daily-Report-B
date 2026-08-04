import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Firm from '../models/Firm.js';
import { tokenBlocklist } from '../middleware/auth.js';

function makeToken(user) {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET env var is not set');
  return jwt.sign(
    { userId: String(user._id), firmId: String(user.firmId), isOwner: user.isOwner },
    process.env.JWT_SECRET,
    { expiresIn: '90d' }
  );
}

export async function ownerLogin(req, res) {
  const { pin } = req.body;
  if (!pin?.trim()) return res.status(400).json({ error: 'PIN is required' });

  if (!process.env.OWNER_PIN)
    return res.status(500).json({ error: 'OWNER_PIN env var is not set on server' });

  if (pin.trim().toUpperCase() !== process.env.OWNER_PIN.toUpperCase())
    return res.status(401).json({ error: 'Incorrect PIN' });

  try {
    const owner = await User.findOne({ isOwner: true }).lean();
    if (!owner) return res.status(500).json({ error: 'Owner account not found — run setup first' });
    const firm = await Firm.findById(owner.firmId).lean();
    const token = makeToken(owner);
    res.json({ token, user: { id: String(owner._id), name: owner.name, isOwner: true, firmName: firm?.name || '' } });
  } catch (err) {
    console.error('ownerLogin error:', err.message);
    res.status(500).json({ error: err.message || 'Login failed' });
  }
}

export async function memberLogin(req, res) {
  const { name, accessCode } = req.body;
  if (!name?.trim() || !accessCode?.trim())
    return res.status(400).json({ error: 'Name and access code are required' });

  try {
    const safeName = name.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const user = await User.findOne({
      name: { $regex: new RegExp(`^${safeName}$`, 'i') },
      accessCode: accessCode.trim().toUpperCase(),
      isOwner: false,
    }).lean();
    if (!user) return res.status(401).json({ error: 'Name or access code is incorrect' });
    const firm = await Firm.findById(user.firmId).lean();
    const token = makeToken(user);
    res.json({ token, user: { id: String(user._id), name: user.name, isOwner: false, firmName: firm?.name || '' } });
  } catch (err) {
    console.error('memberLogin error:', err.message);
    res.status(500).json({ error: err.message || 'Login failed' });
  }
}

export function logout(req, res) {
  tokenBlocklist.add(req.token);
  res.json({ ok: true });
}
