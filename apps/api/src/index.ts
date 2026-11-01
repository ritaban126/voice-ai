// PURPOSE: starts the Express server. Order matters: Better Auth must be mounted BEFORE express.json().
import { env } from './env'; // keep first: loads .env before the db / auth packages read it
import cors from 'cors';
import express from 'express';
import { authHandler } from './lib/auth';
import { startJobs } from './jobs';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import meRoutes from './routes/me';
import notificationRoutes from './routes/notifications';
import orderRoutes from './routes/orders';
import paymentRoutes from './routes/payments';
import requestRoutes from './routes/requests';
import statsRoutes from './routes/stats';
import voiceRoutes from './routes/voice';
import workerRoutes from './routes/workers';

const app = express();
app.set('trust proxy', 1); // behind the Next.js proxy
app.use(cors({ origin: env.WEB_URL, credentials: true }));

app.all('/api/auth/*splat', authHandler); // OTP login (Better Auth): /api/auth/phone-number/send-otp etc.
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/me', meRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`KaamBol API running on http://localhost:${env.PORT}`);
  startJobs();
});
