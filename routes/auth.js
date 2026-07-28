import express from 'express';
import { auth } from '../middleware/auth.js';
import { ownerLogin, memberLogin, logout } from '../controllers/authController.js';

const router = express.Router();

router.post('/owner-login', ownerLogin);
router.post('/login', memberLogin);
router.post('/logout', auth, logout);

export default router;
