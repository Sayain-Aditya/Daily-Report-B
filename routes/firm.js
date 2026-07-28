import express from 'express';
import { auth, ownerOnly } from '../middleware/auth.js';
import { getFirmEntries, getReps, addMember, getStats } from '../controllers/firmController.js';

const router = express.Router();

router.use(auth, ownerOnly);

router.get('/entries', getFirmEntries);
router.get('/reps', getReps);
router.get('/stats', getStats);
router.post('/members', addMember);

export default router;
