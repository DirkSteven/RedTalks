import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'

export async function register(req, res) {
    // res.json('register route');

  // Validate incoming data
  const { name, email, password, imageUrl } = req.body;

  if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
      // Check if the user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
          return res.status(400).json({
              message: 'User already exists'
          });
      }

      // Hash password and create new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
          name,
          email,
          password: hashedPassword,
          imageUrl: imageUrl || '', // Default to empty string if no image URL is provided
          role: 'user',
      });

      // Save user to the database
      await newUser.save();
      res.status(201).json({
          message: 'User created successfully',
          user: {
              name: newUser.name,
              email: newUser.email,
              imageUrl: newUser.imageUrl,
          },
      });
  } catch (error) {
      res.status(500).json({
          message: 'Error registering user',
          error: error.message,
      });
  }

    // const userExists = await User.findOne({email: req.body.email});
    // if(userExists){
    //     return res.status(400).json({
    //         message: 'User already exists'
    //     })
    // };

    // const newUser = User({
    //     name: req.body.name,
    //     email: req.body.email, 
    //     password: await bcrypt.hash(req.body.password, 10),
    //     imageUrl: req.body.imageUrl, 
    //     role: 'user'
    // });

    // // await newUser.save();
    // // res.status(201).json({
    // //     message: 'User created successfully',
    // // });

    // try {
    //     await newUser.save();
    //     res.status(201).json({
    //         message: 'User created successfully',
    //     });
    // } catch (error) {
    //     res.status(500).json({
    //         message: 'Error registering user',
    //         error: error.message,
    //     });
    // }
}

export async function login(req, res) {
    // res.json('login route');
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

    // const { email, password } = req.body;

    // try {
    //   const user = await User.findOne({ email });
    //   if (!user) {
    //     return res.status(400).json({ message: 'User does not exist' });
    //   }
  
    //   const passwordIsEqual = await bcrypt.compare(password, user.password);
    //   if (!passwordIsEqual) {
    //     return res.status(401).json({ message: 'Password incorrect' });
    //   }
  
    //   const token = jwt.sign({ userId: user._id }, 'app', { expiresIn: '1h' });
    //   res.json({ user, token });
    // } catch (error) {
    //   res.status(500).json({ message: 'Error logging in', error: error.message });
    // }

}

export async function initUser(req, res){
    console.log('getUser/init route');

    const token = req.query.token;
    console.log('Token received (init):', token);


    let user = null;
    let response = null;

    try{
        const userData = jwt.verify(token, 'app');
        response = await User.findById(userData.userId);
        // console.log("User found: ", response);
    }catch(e){
        // console.error("Error verifying token or fetching user:", e);
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

}

export async function updateUser(req, res){
    // res.json('updateuser route');

    const { name, email, imageUrl } = req.body;

    try {
        const user = await User.findOne({email: req.body.email});
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update fields if provided
      if (name) user.name = name;
      if (email) user.email = email;
      if (imageUrl) user.imageUrl = imageUrl;
  
      await user.save();
      res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
      res.status(500).json({ message: 'Error updating user', error: error.message });
    }

}

export async function resetPasword(req, res){
    res.json('resetPassword route');
}