import { Router } from 'express';
// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcryptjs'; 
// import User from '../models/User.js';

const router = Router();
import * as userController from '../controllers/User.js'


// Route to register a new user
router.post('/register', userController.register);
// Invoke-WebRequest -Uri http://localhost:5000/api/user/register -Method POST -Body '{"name": "John", "email": "john@example.com", "password": "password"}' -ContentType "application/json"
  
// Route to log in a user
router.post('/login', userController.login);
// Invoke-WebRequest -Uri http://localhost:5000/api/user/login -Method POST -Body '{"email": "alice@example.com", "password": "password123"}' -ContentType "application/json"

// Route to initialize user data using token
router.get('/init', userController.initUser);
// Invoke-WebRequest -Uri "http://localhost:5000/api/user/init?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzJjOGM0NGYwYWI3NDZlNjhiZmNjYTkiLCJpYXQiOjE3MzEzMzIzNjIsImV4cCI6MTczMTMzNTk2Mn0.krx6leoMgZ5RMV8o3w6A03M0q_0xZEQdPlQHLB9aqWY" -Method GET

// Route to update user details
router.put('/updateuser', userController.updateUser);
// Invoke-RestMethod -Uri "http://localhost:5000/api/user/updateuser" -Method PUT -Headers @{ "Content-Type" = "application/json" } -Body '{"name": "Bobbb Smith", "email": "bob@example.com", "imageUrl": "https://example.com/images/bob.jpg"}'

router.post('/changepassword', userController.resetPasword);

export default router;