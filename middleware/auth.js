import jwt from 'jsonwebtoken';

export const tokenBlocklist = new Set();

export function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = header.slice(7);
  if (tokenBlocklist.has(token)) {
    return res.status(401).json({ error: 'Token revoked' });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;
    req.firmId = payload.firmId;
    req.isOwner = payload.isOwner || false;
    req.token = token;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
