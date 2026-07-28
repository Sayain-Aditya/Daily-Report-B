import express from 'express';
import { auth } from '../middleware/auth.js';
import { getEntries, createEntry, updateEntry, deleteEntry } from '../controllers/entryController.js';

const router = express.Router();

router.use(auth);

router.get('/', getEntries);
router.post('/', createEntry);
router.put('/:id', updateEntry);
router.delete('/:id', deleteEntry);

export default router;
