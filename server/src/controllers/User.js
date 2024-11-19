import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'
import Post from '../models/Post.js';
import { validateEmail } from '../utils/validate.js'


export async function getUserPosts(req, res) {
    try {
      const { userId } = req.params;
  
      const posts = await Post.find({ author: userId })
        .populate('author', 'name email')  // Populate user data for the author
        .sort({ createdAt: -1 });  // Optionally, sort by creation date
  
      return res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      return res.status(500).json({ message: 'Error fetching user posts', error: error.message });
    }
  }
  
  export async function getUserComments(req, res) {
    try {
      const { userId } = req.params;
  
      // Aggregate posts with comments by this user
      const posts = await Post.find({ "comments.author": userId })
        .populate('author', 'name email')
        .populate('comments.author', 'name email')  // Populate user data for comment authors
        .sort({ createdAt: -1 });
  
      // Filter and return only the comments by the specific user
      const userComments = posts.flatMap(post =>
        post.comments.filter(comment => comment.author._id.toString() === userId)
      );
  
      return res.status(200).json(userComments);
    } catch (error) {
      console.error('Error fetching user comments:', error);
      return res.status(500).json({ message: 'Error fetching user comments', error: error.message });
    }
  }
  
  export async function getUserUpvotes(req, res) {
    try {
      const { userId } = req.params;
  
      // Query posts where the user has upvoted
      const posts = await Post.find({ upvotes: userId })
        .populate('author', 'name email')  // Populate user data for the author
        .sort({ createdAt: -1 });  // Optionally, sort by creation date
  
      return res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching user upvotes:', error);
      return res.status(500).json({ message: 'Error fetching user upvotes', error: error.message });
    }
  }

export async function register(req, res) {
    // res.json('register route');

  // Validate incoming data
  const { name, email, password, imageUrl } = req.body;

  if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({
        message: 'Invalid email format. It should match the pattern "user@g.batstate-u.edu.ph".',
    });
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


}

export async function initUser(req, res){
    console.log('/init route');

    // const token = req.query.token;
    // console.log('Token received (init):', token);

    const token = req.headers.authorization?.split(' ')[1];  // Get token from Authorization header
    console.log('Token received (init):', token);

    let user = null;
    let response = null;

    try{
        const userData = jwt.verify(token, 'app');
        response = await User.findById(userData.userId);
    }catch(e){
        console.error("Error verifying token or fetching user:", e);
        return res.status(401).json({ message: 'Invalid token' });
    }

    if (response) {
        res.status(200).json({ user: response });
    } else {
        res.status(404).json({ message: 'User not found' });
    }

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
    try {
        const { userId, currentPassword, newPassword } = req.body;

        // Validate the input
        if (!userId || !currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Find the user by userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the current password with the stored password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the password in the database
        user.password = hashedPassword;
        await user.save();

        // Respond with success message
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Server error' });
    }
}