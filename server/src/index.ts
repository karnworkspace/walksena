
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import walkInRoutes from './routes/walkIn';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/walkin', walkInRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from the Walk-in Form API!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
