
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

// Serve React frontend static files
const frontendPath = path.join(__dirname, '../../walk-in-form/build');
app.use(express.static(frontendPath));

// API health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Walk-in Form API is running!' });
});

// Serve React app for all other routes
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`📁 Serving frontend from: ${frontendPath}`);
});
