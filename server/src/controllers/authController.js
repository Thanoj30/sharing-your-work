import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const emailPattern = /^\S+@\S+\.\S+$/;

const createToken = (userId) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.sign({ id: userId }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

const buildUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  profileImage: user.profileImage,
  contactInfo: user.contactInfo,
  helpCount: user.helpCount
});

const getValidationMessage = (error) => (
  Object.values(error.errors || {})
    .map((validationError) => validationError.message)
    .join(', ') || error.message
);

const validateRegistrationInput = ({ name, email, password }) => {
  if (!name?.trim() || !email?.trim() || !password) {
    return 'Name, email, and password are required';
  }

  if (!emailPattern.test(email.trim())) {
    return 'Please enter a valid email address';
  }

  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }

  return '';
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, profileImage = '', contactInfo = {} } = req.body;
    const validationError = validateRegistrationInput({ name, email, password });

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      profileImage: profileImage?.trim() || '',
      contactInfo: {
        phone: contactInfo.phone?.trim() || '',
        address: contactInfo.address?.trim() || ''
      }
    });

    return res.status(201).json({
      message: 'User registered successfully',
      user: buildUserResponse(user),
      token: createToken(user._id)
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: getValidationMessage(error) });
    }

    if (error.code === 11000) {
      return res.status(409).json({ message: 'User already exists with this email' });
    }

    return res.status(500).json({ message: 'Registration failed' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (!emailPattern.test(email.trim())) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.status(200).json({
      message: 'Login successful',
      user: buildUserResponse(user),
      token: createToken(user._id)
    });
  } catch (_error) {
    return res.status(500).json({ message: 'Login failed' });
  }
};

export const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    user: buildUserResponse(req.user)
  });
};
