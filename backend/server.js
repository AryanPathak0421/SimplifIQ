import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import leadRoutes from './src/routes/leadRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const ALLOWED_ORIGINS = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Enable CORS for frontend integration
app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser tools (no origin header)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    return callback(new Error('CORS blocked: origin not allowed'));
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Ensure the storage/reports directory exists for PDF compilation
const reportsDir = path.resolve('storage/reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// Serve compiled PDF reports statically
app.use('/reports', express.static(reportsDir));

// Mount routing endpoints
app.use('/api/leads', leadRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'Healthy',
    service: 'SimplifIQ Growth Advisory Automation Workflow',
    timestamp: new Date().toISOString()
  });
});

// Run server listener with graceful error handling and shutdown hooks
// Track active requests so we can wait for in-flight work when shutting down
let activeRequests = 0;
app.use((req, res, next) => {
  activeRequests += 1;
  res.on('finish', () => {
    activeRequests -= 1;
  });
  next();
});

// Start the server with retry logic in case the port is temporarily in use
let server = null;
const maxListenRetries = 30; // retry up to ~60s
const listenRetryDelay = 2000; // ms

const startServer = async () => {
  let attempts = 0;
  while (attempts <= maxListenRetries) {
    try {
      server = app.listen(PORT, () => {
        console.log(`=========================================`);
        console.log(` SimplifIQ Automation Server Running     `);
        console.log(` Port: ${PORT}                           `);
        console.log(` Environment: Prototype                  `);
        console.log(`=========================================`);
      });

      // attach error handler
      server.on('error', (err) => {
        console.error('Server encountered an error:', err);
      });

      return;
    } catch (err) {
      attempts += 1;
      if (err && err.code === 'EADDRINUSE') {
        console.warn(`Port ${PORT} is currently in use. Retry ${attempts}/${maxListenRetries} in ${listenRetryDelay}ms...`);
        // wait and retry
        // eslint-disable-next-line no-await-in-loop
        await new Promise(r => setTimeout(r, listenRetryDelay));
        continue;
      }
      console.error('Failed to start server:', err);
      process.exit(1);
    }
  }

  console.error(`Unable to bind to port ${PORT} after ${maxListenRetries} attempts.`);
  process.exit(1);
};

startServer();

// Graceful shutdown for nodemon restarts and termination signals
const shutdown = (signal) => {
  return async () => {
    console.log(`Received ${signal}. Graceful shutdown initiated...`);
    try {
      // Stop accepting new connections
      server.close(() => {
        console.log('Stopped accepting new connections.');
      });

      const start = Date.now();
      const timeoutMs = 60000; // wait up to 60s for active requests to finish

      // Poll until no active requests or timeout
      while (activeRequests > 0 && (Date.now() - start) < timeoutMs) {
        console.log(`Waiting for ${activeRequests} active request(s) to finish before shutdown...`);
        // eslint-disable-next-line no-await-in-loop
        await new Promise(r => setTimeout(r, 500));
      }

      if (activeRequests === 0) {
        console.log('All active requests finished, exiting.');
        process.exit(0);
      }

      console.warn('Active requests did not finish in time, forcing exit.');
      process.exit(1);
    } catch (e) {
      console.error('Error during shutdown:', e);
      process.exit(1);
    }
  };
};

process.on('SIGINT', shutdown('SIGINT'));
process.on('SIGTERM', shutdown('SIGTERM'));
// nodemon uses SIGUSR2 to restart
process.once('SIGUSR2', () => {
  shutdown('SIGUSR2')().then(() => process.kill(process.pid, 'SIGUSR2'));
});
