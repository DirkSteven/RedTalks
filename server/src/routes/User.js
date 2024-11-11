import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; 
import User from '../models/User.js';

const router = Router();
import * as controller from '../controllers/User.js'
// export const router = Router();


router.get("/init", async (req, res) => {
    const token = req.query.token;
    console.log('Token received (init):', token);

    let user = null;
    let response = null;

    try{
        const userData = jwt.verify(token, 'app');
        response = await User.findById(userData.userId);
        // console.log("User found: ", response);
    }catch(e){
        console.error("Error verifying token or fetching user:", e);
        return res.status(401).json({ message: 'Invalid token' });
        // response = null;
    }

    // if(user){
    //      response = user;
    // }

    if (response) {
        res.status(200).json({ user: response });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
    

    res.send({user: response});
});
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

router.route('/register').post(controller.register);
// router.post('/register', async (req, res) =>{
   
//     const userExists = await User.findOne({email: req.body.email});
//     if(userExists){
//         return res.status(400).json({
//             message: 'User already exists'
//         })
//     };

//     const newUser = User({
//         name: req.body.name,
//         email: req.body.email, 
//         password: await bcrypt.hash(req.body.password, 10),
//         imageUrl: req.body.imageUrl, 
//         role: 'user'
//     });

//     // await newUser.save();
//     // res.status(201).json({
//     //     message: 'User created successfully',
//     // });

//     try {
//         await newUser.save();
//         res.status(201).json({
//             message: 'User created successfully',
//         });
//     } catch (error) {
//         res.status(500).json({
//             message: 'Error registering user',
//             error: error.message,
//         });
//     }
// });

router.post('/login', async (req, res) =>{
    res.json('login route');
    const user = await User.findOne({email: req.body.email});
    if(!user){
        return res.status(400).send({
            message: 'User does not exist'
        })
    };

    const passwordIsEqual = await bcrypt.compare(req.body.password, user.password);
    if(!passwordIsEqual){
        return res.status(401).send({
            message: 'Password Incorrect'
        });
    };

    const token = jwt.sign({userId: user._id}, 'app', {
        expiresIn: '1h', //token expiration time
    });
    res.send({
        user, 
        token
    });
});

router.put('/updateuser', async (req,res) => {

})

export default router;