
import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';

import path from 'path';
// import { run } from './db/connectDB.js'
import { connectDB } from './db/connectDB.js'
import { userRouter } from './src/routes/index.js';

dotenv.config();

const app = express();

app.use(cors());

app.use(bodyParser.json());

const PORT = 5000;
// const __dirname = path.dirname(new URL(import.meta.url).pathname);
const __dirname = path.resolve(); 

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

app.use('/api/user', userRouter);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
    console.log(path.join(__dirname, '..', "client/build/index.html"));
});

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
