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

// Enable CORS for frontend integration
app.use(cors({
  origin: '*', // Allow all origins for the prototype
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

// Run server listener
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` SimplifIQ Automation Server Running     `);
  console.log(` Port: ${PORT}                           `);
  console.log(` Environment: Prototype                  `);
  console.log(`=========================================`);
});
