import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nextgenhrlab';

app.use(
  cors({
    origin: CLIENT_ORIGIN,
  }),
);
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'nextgenhrlab-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/courses', courseRoutes);

async function start() {
  try {
    if (!process.env.JWT_SECRET) {
      console.warn('Warning: JWT_SECRET is not set. Auth routes will fail until it is configured.');
    }
    if (/127\.0\.0\.1|localhost/.test(MONGODB_URI)) {
      console.warn(
        'MONGODB_URI points to localhost. Set your Atlas cluster URI in backend/.env to connect to your cluster.',
      );
    }
    await connectDB(MONGODB_URI);
    const server = app.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`);
    });

    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop the other process or change PORT in backend/.env.`);
        process.exit(1);
      }

      console.error('Failed to start server:', error.message);
      process.exit(1);
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Failed to start server:', message);
    process.exit(1);
  }
}

start();
