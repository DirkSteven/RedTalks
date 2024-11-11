
import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';

import path from 'path';
import { connectDB } from './db/connectDB.js'
import userRouter from './src/routes/User.js';
import postRouter from './src/routes/Post.js';
// import { userRouter, postRouter } from './src/routes/index.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,
}));

app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve(); 


app.use('/api/user', userRouter);
app.use('/api/posts', postRouter);

app.get('/', (req, res) => {
  console.log("Home route");
  res.status(201).json("Home");
})


// app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

// // HTTP GET REQUEST
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'client', 'build','index.html'));
//     // console.log(path.join(__dirname, '..', "client/build/index.html"));
// });

// Start server when connection is valid
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to start the server:', err);
  process.exit(1); // Exit if MongoDB connection fails
});


// Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
// Set-ExecutionPolicy AllSigned -Scope CurrentUser


// bxyCi9t1lQ51Jvd3
// admin admin
