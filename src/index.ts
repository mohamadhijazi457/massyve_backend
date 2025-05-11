import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './services/db';
const app = express();
// app.use(cors({
//   origin: process.env.NODE_ENV === 'production' ? 'https://your-frontend-app.herokuapp.com' : 'http://localhost:3000',
//   credentials: true
// }));
// app.use(express.urlencoded({ extended: true }))

app.use(cors({ origin: true, credentials: true }));

import authRoutes from './auth/authRoute';

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development',
});

const port: number = parseInt(process.env.PORT as string, 10); // Type assertion for safe conversion


// MongoDB Connection
connectDB();

// Use the authRoutes for requests starting with /auth
app.use('/auth', authRoutes); // Mount the authRoutes at /auth

app.get('/', (req: Request, res: Response) => {
  res.send('API is working!');
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

// Starting the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
