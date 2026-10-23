import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.routes.js';
import { initDatabase } from './db/init.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'Verdict Editorial API', timestamp: new Date() });
});

// API Routes
app.use('/api/v1', apiRoutes);
app.use('/api', apiRoutes);

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error occurred.',
  });
});

// Initialize database and start listening
initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[Verdict Server] Active and running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.warn('[Verdict Server] Started with graceful database resilience:', err.message);
    app.listen(PORT, () => {
      console.log(`[Verdict Server] Fallback active on http://localhost:${PORT}`);
    });
  });

export default app;
