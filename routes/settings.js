import express from 'express';
import { auth } from '../middleware/auth.js';
import { getSettings, saveSettings } from '../controllers/settingsController.js';

const router = express.Router();

router.use(auth);

router.get('/', getSettings);
router.post('/', saveSettings);

export default router;
