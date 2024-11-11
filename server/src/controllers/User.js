import bcrypt from 'bcryptjs';
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
    res.json('login route');
    

}

export async function getUser(req, res){
    res.json('getUser route');
}

export async function updateUser(req, res){
    res.json('updateuser route');
}

export async function resetPasword(req, res){
    res.json('resetPassword route');
}