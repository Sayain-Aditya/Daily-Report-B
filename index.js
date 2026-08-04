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

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://daily-report-f-two.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

// Connect DB BEFORE routes — must run first on every cold start
app.use(async (req, res, next) => {
  try {
    await connectDatabase(process.env.MONGO_URI);
    next();
  } catch (err) {
    console.error('DB connection failed:', err.message);
    res.status(503).json({ error: 'Database unavailable, please retry' });
  }
});

app.use('/api/auth', authRouter);
app.use('/api/entries', entriesRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/firm', firmRouter);

// Local dev only — Vercel does not use app.listen()
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
