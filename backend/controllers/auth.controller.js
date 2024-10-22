import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendWelcomeEmail } from '../emails/emailHandlers.js';

export const signup = async (req, res) => {
  try {
    const { name, username, password, email } = req.body;

    if (!name || !username || !password || !email) {
      return res.status(400).json({ message: 'all fields are required' });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      username,
      password: hashedPassword,
      email,
    });

    await user.save();

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '3d',
      }
    );

    res.cookie('jwt-linkin', token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: 'strict', // prevents CSRF atacks "cross site request forgery"
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(201).json({ mesage: 'user created successfully' });

    const profileUrl = process.env.CLIENT_URL + 'profile/' + user.username;

    try {
      await sendWelcomeEmail(user.email, user.name, profileUrl);
    } catch (emailError) {
      console.error('Error sending welcome email', emailError);
    }
  } catch (err) {
    console.log('Error in signup: ', err.message);
    res.status(500).json({ mesage: 'Internal Server Error' });
  }
};
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ mesage: 'invalid credentials' });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'invalid credentials - p' }); // this "p" is just for testing purposes in development
    }
    // create and set token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '3d',
    });
    res.cookie('jwt-linkin', token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    res.json({ message: 'successfull logged in' });
  } catch (error) {
    console.error('Error in login controller ', error);
    res.status(500).json({ message: 'Server error' });
  }
};
export const logout = async (req, res) => {
  res.clearCookie('jwt-linkin');
  res.json({ mesage: 'Logged out successfully' });
};
export const getCurrentUser = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.log('Error in getCurrentUser controller ', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
