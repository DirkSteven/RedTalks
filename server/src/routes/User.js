import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; 
import User from '../models/User.js';

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


// router.get("/init", async (req, res) => {
//     const token = req.query.token;
//     console.log('Token received (init):', token);

//     let user = null;
//     let response = null;

//     try{
//         const userData = jwt.verify(token, 'app');
//         response = await User.findById(userData.userId);
//         // console.log("User found: ", response);
//     }catch(e){
//         // console.error("Error verifying token or fetching user:", e);
//         return res.status(401).json({ message: 'Invalid token' });
//         // response = null;
//     }

//     // if(user){
//     //      response = user;
//     // }

//     if (response) {
//         res.status(200).json({ user: response });
//     } else {
//         res.status(404).json({ message: 'User not found' });
//     }
    

//     res.send({user: response});
// });

// router.get("/init", async (req, res) => {
//     console.log('init route hit')
//     const token = req.query.token;
//     let user = null;
//     let response = null;
  
//     if (!token) {
//       return res.status(400).json({ message: 'Token is missing' });
//     }
  
//     try {
//       const userData = jwt.verify(token, 'app'); // Verify the token with secret
//       user = await User.findById(userData.userId); // Fetch user by ID
  
//       if (!user) {
//         console.log('User not found');
//         return res.status(404).json({ message: 'User not found' });
//       }
  
//       response = user; // Send user data if found
//     } catch (e) {
//       console.error('Error verifying token or fetching user:', e);
//       return res.status(401).json({ message: 'Invalid token or failed to fetch user' });
//     }
  
//     res.json({ user: response });
//   });


// router.post('/login', async (req, res) =>{
//     res.json('login route');
//     const user = await User.findOne({email: req.body.email});
//     if(!user){
//         return res.status(400).send({
//             message: 'User does not exist'
//         })
//     };

//     const passwordIsEqual = await bcrypt.compare(req.body.password, user.password);
//     if(!passwordIsEqual){
//         return res.status(401).send({
//             message: 'Password Incorrect'
//         });
//     };

//     const token = jwt.sign({userId: user._id}, 'app', {
//         expiresIn: '1h', //token expiration time
//     });
//     res.send({
//         user, 
//         token
//     });
// });


export default router;