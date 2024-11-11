
import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';

import path from 'path';
import { connectDB } from './db/connectDB.js'
import router from './src/routes/User.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,
}));

app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve(); 

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

app.use('/api/user', router);

// HTTP GET REQUEST
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'client', 'build','index.html'));
//     console.log(path.join(__dirname, '..', "client/build/index.html"));
// });

app.get('/', (req, res) => {
  res.send({
    message: 'Hello World'
  });
})

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
