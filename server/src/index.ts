
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import walkInRoutes from './routes/walkIn';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/walkin', walkInRoutes);

// Serve React frontend static files (optional)
// In Render we deploy backend-only, so guard this with an env flag.
const serveFrontend = process.env.SERVE_FRONTEND === 'true';
const frontendPath = path.join(__dirname, '../../walk-in-form/build');
if (serveFrontend) {
  app.use(express.static(frontendPath));
}

// API health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Walk-in Form API is running!' });
});

// Serve React app for all other routes (only when serving frontend)
if (serveFrontend) {
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
  if (serveFrontend) {
    console.log(`📁 Serving frontend from: ${frontendPath}`);
  } else {
    console.log('🛠️  Frontend static serving is disabled (SERVE_FRONTEND != true)');
  }
});
