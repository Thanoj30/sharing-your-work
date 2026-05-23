import cors from 'cors';
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import friendRoutes from './routes/friendRoutes.js';
import parcelRoutes from './routes/parcelRoutes.js';

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173'
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/parcels', parcelRoutes);

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Sharing Your Work API setup is running.'
  });
});

app.use(notFound);
app.use(errorHandler);

export default app;
