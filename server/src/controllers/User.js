import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'
import Post from '../models/Post.js';
import Token from '../models/Token.js';
import { validateEmail } from '../utils/validate.js'
import sendEmail from '../utils/sendEmail.js'
import dotenv from 'dotenv';
dotenv.config();

export async function getUser(req, res) {
  try {
    const user = await User.findById(req.params.userId).select('name email imageUrl');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
}

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
        .populate('comments.author', 'name email')
        .select('title comments')
        .sort({ createdAt: -1 });
  
      // Filter and return only the comments by the specific user
      const userComments = posts.flatMap(post =>
        post.comments
            .filter(comment => comment.author._id.toString() === userId)
            .map(comment => ({
                content: comment.content,
                postTitle: post.title || null,
                postId: post._id || null,
            }))
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
        .populate('author', 'name email')
        .select('title content createdAt author upvotes comments')
        .sort({ createdAt: -1 }); 
  
      return res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching user upvotes:', error);
      return res.status(500).json({ message: 'Error fetching user upvotes', error: error.message });
    }
  }

export async function register(req, res) {
  const { name, email, password, imageUrl } = req.body;

  if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({
        message: 'Invalid email format. It should match the pattern "user@g.batstate-u.edu.ph".',
    });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
  }

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
          message: 'User already exists'
      });
    }

    //hashing already in models (pre save hook)

    const newUser = new User({
      name,
      email,
      password: password,
      imageUrl: imageUrl || '',
      verified: false,
      role: 'user',
    });

    await newUser.save();
    
    const verificationToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    const tokenRecord = new Token({
      userId: newUser._id,
      token: verificationToken,
      expiresAt: Date.now() + 3600000, // token expires in 1 hour
    });

    await tokenRecord.save();

    const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    const emailSubject = 'Please verify your email address';
    const emailText = `Hello ${name},\n\nClick the following link to verify your email: ${verificationLink}`;
    const emailHtml = `
      <p>Hello ${name},</p>
      <p>Click <a href="${verificationLink}">here</a> to verify your email address.</p>
    `;

    await sendEmail(email, emailSubject, emailText, emailHtml);

    const token = jwt.sign({userId:  newUser._id}, process.env.JWT_SECRET, {
      expiresIn: '1h', //token expiration time
    }); 

    res.status(201).json({
      message: 'User created successfully. A verification email has been sent.',
      user: {
          name: newUser.name,
      },
      token,
    });

  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({
      message: 'Error registering user',
      error: error.message,
    });
  }
}

export async function verifyEmail(req, res) {
  const { verificationToken } = req.params;
  // console.log('Received token from URL:', verificationToken);

  try {
    const decoded = jwt.verify(verificationToken, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.verified) {
      return res.status(200).json({ message: 'Email already verified' });
    }

    user.verified = true;
    await user.save();

    await Token.deleteOne({ token: verificationToken });

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error during email verification:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Verification token has expired. Please request a new verification link.' });
    }

    return res.status(400).json({ message: 'Invalid or expired verification token' });
  }
}


export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide both email and password' });
  } 

  try {
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'User does not exist' });
    }

    if (user.lockoutTime) {
      const lockoutRemainingTime = user.lockoutTime - Date.now();

      //if lockout time not expired, block attempts
      if (lockoutRemainingTime > 0) {
        const lockoutMinutes = Math.floor(lockoutRemainingTime / 1000 / 60);
        return res.status(403).json({
          message: `Account locked. Please try again in ${lockoutMinutes} minutes.`,
        });
      } else {
        // Reset lockout time if the lockout period has expired
        user.lockoutTime = null;
        // user.failedAttempts = 0; 
        await user.save();
      }
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      user.failedAttempts += 1;

      let lockoutDuration;

      if (user.failedAttempts >= 5) {
        lockoutDuration = 60 * 60 * 1000; // 1 hour
      } else if (user.failedAttempts >= 3) {
        lockoutDuration = 5 * 60 * 1000; // 5 minutes
      }

      if (lockoutDuration) {
        user.lockoutTime = Date.now() + lockoutDuration;
      }

      const remainingAttempts = 3 - user.failedAttempts;

      await user.save();

      if (user.failedAttempts >= 3) {
        // If failed attempts exceed or equal 3, show a generic message
        return res.status(401).json({
          message: 'Invalid email or password.',
        });
      }

      return res.status(401).json({
        message: `Invalid email or password. ${remainingAttempts} attempts before lockout.`,
        lockoutTimeRemaining: remainingAttempts >= 1 ? null : lockoutDuration / 1000 / 60 // Time left if locked out
      });
    }

    user.failedAttempts = 0;
    user.lockoutTime = null;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { 
      expiresIn: '1h' 
    });

    res.status(200).json({
        message: 'Login successful',
        user: {
            name: user.name,
        },
        token,
    });
  } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'An error occurred during login', error: error.message });
  }
}

export async function initUser(req, res){
    // console.log('/init route');

    // const token = req.query.token;
    // console.log('Token received (init):', token);

    const token = req.headers.authorization?.split(' ')[1];  // Get token from Authorization header
    // console.log('Token received (init):', token);

    let user = null;
    let response = null;

    try{
        const userData = jwt.verify(token, process.env.JWT_SECRET);
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
    const { name, email, imageUrl } = req.body;
    const { userId } = req.params; 

    try {
        // const user = await User.findOne({email: req.body.email});
        const user = await User.findById(userId); 
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

// export async function resetPasword(req, res){
//   const { currentPassword, newPassword } = req.body;

//   // Use userId from the authenticated user
//   const { userId } = req.user;

//   try {
//       // Validate the input
//       if (!currentPassword || !newPassword) {
//           return res.status(400).json({ message: 'Please provide all required fields' });
//       }

//       // Find the user by userId
//       const user = await User.findById(userId);
//       if (!user) {
//           return res.status(404).json({ message: 'User not found' });
//       }

//       // Compare the current password with the stored password
//       const isMatch = await bcrypt.compare(currentPassword, user.password);
//       if (!isMatch) {
//           return res.status(400).json({ message: 'Current password is incorrect' });
//       }

//       // Hash the new password
//       const hashedPassword = await bcrypt.hash(newPassword, 10);
      
//       // Update the user's password
//       user.password = hashedPassword;
//       await user.save();

//       res.status(200).json({ message: 'Password updated successfully' });
//   } catch (error) {
//       console.error('Error changing password:', error);
//       res.status(500).json({ message: 'Server error' });
//   }
// }


export async function requestVerificationCode(req, res) {
  const { email } = req.body;

  if (!email) {
      return res.status(400).json({ message: 'Email is required' });
  }

  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const existingToken = await Token.findOne({ userId: user._id });
      if (existingToken && existingToken.expiresAt > Date.now()) {
          return res.status(400).json({ message: 'A verification code has already been sent and is still valid.' });
      }

      // Generate a random verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

      const newToken = new Token({
        userId: user._id, 
        token: verificationCode,
        expiresAt: Date.now() + 3600000,
      });

      const emailSubject = 'Password Reset Verification Code';
      const emailText = `Your verification code is: ${verificationCode}`;
      const emailHtml = `<p>Your verification code is: <strong>${verificationCode}</strong></p>`;


      await newToken.save();
      await sendEmail(email, emailSubject, emailText, emailHtml);

      res.status(200).json({ message: 'Verification code sent to your email' });
  } catch (error) {
      console.error('Error sending verification code:', error);
      res.status(500).json({ message: 'An error occurred while sending the verification code' });
  }
}

export async function resetPasswordWithCode(req, res) {
  const { email, verificationCode, newPassword } = req.body;

  if ( !email || !verificationCode || !newPassword) {
    return res.status(400).json({ message: 'Email, verification code, and new password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const tokenDoc = await Token.findOne({ userId: user._id, token: verificationCode });
    if (!tokenDoc) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    if (tokenDoc.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'Verification code has expired' });
    }

    user.password = newPassword;
    await user.save();

    // Optionally delete the token after use (or mark it as used)
    await Token.deleteOne({ userId: user._id, token: verificationCode });

    res.status(200).json({ message: 'Password reset successful' });
    
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'An error occurred while resetting the password' });
  }
}