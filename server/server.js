import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { connectDB } from './src/config/connectDB.js'
import userRouter from './src/routes/User.js';
import postRouter from './src/routes/Post.js';

// Load environment variables first
dotenv.config();

// Define PORT constant at the top level
const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

const __dirname = path.resolve();

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

app.use('/api/user', userRouter);
app.use('/api/posts', postRouter);

app.use('/api/user/verify-email', (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.get('/', (req, res) => {
  console.log("Home route");
  res.status(201).json("Home");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server when connection is valid
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('CORS enabled for:', ['http://localhost:3000', 'http://127.0.0.1:3000']);
  });
}).catch((err) => {
  console.error('Failed to start the server:', err);
  process.exit(1);
});