import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDatabase } from './database.js';
import authRouter from './routes/auth.js';
import entriesRouter from './routes/entries.js';
import settingsRouter from './routes/settings.js';
import firmRouter from './routes/firm.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/entries', entriesRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/firm', firmRouter);

connectDatabase(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to database:', err.message);
    process.exit(1);
  });
