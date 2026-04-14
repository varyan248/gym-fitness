// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');
const { protect } = require('../middleware/Auth.js');

// Clean environment variable helper
const cleanEnvVar = (value) => {
  if (!value) return value;
  return value.trim().replace(/^["']|["']$/g, '').replace(/,/g, '');
};

// Generate JWT with cleaned values
const generateToken = (id) => {
  const secret = cleanEnvVar(process.env.JWT_SECRET);
  const expiresIn = cleanEnvVar(process.env.JWT_EXPIRE);
  
  console.log('Generating token with:', { 
    secretExists: !!secret, 
    expiresIn: expiresIn 
  });
  
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  return jwt.sign({ id }, secret, {
    expiresIn: expiresIn || '7d',
  });
};

// @route   POST /api/auth/register
// @desc    Register user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, age, height, weight, goal } = req.body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide name, email and password' 
      });
    }
    
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    
    // Create user
    const user = await User.create({
      name,
      email,
      password,
      age: age || null,
      height: height || null,
      weight: weight || null,
      goal: goal || 'Stay Fit',
    });
    
    console.log('User registered:', user.name, user.email);
    
    if (user) {
      // Generate token
      const token = generateToken(user._id);
      
      // Remove password from response
      const userResponse = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        age: user.age,
        height: user.height,
        weight: user.weight,
        goal: user.goal,
      };
      
      res.status(201).json({
        success: true,
        token: token,
        user: userResponse,
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email and password' 
      });
    }
    
    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    
    // Check password
    const isPasswordMatch = await user.matchPassword(password);
    
    if (isPasswordMatch) {
      // Update last login
      user.lastLogin = Date.now();
      await user.save();
      
      // Generate token
      const token = generateToken(user._id);
      
      // Remove password from response
      const userResponse = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        age: user.age,
        height: user.height,
        weight: user.weight,
        goal: user.goal,
      };
      
      res.json({
        success: true,
        token: token,
        user: userResponse,
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
router.get('/me', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/auth/change-password
// @desc    Change user password
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current and new password' });
    }

    const user = await User.findById(req.user._id).select('+password');
    
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect current password' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add this endpoint to your authRoutes.js
router.post('/register-admin', async (req, res) => {
  try {
    const { name, email, password, adminSecret } = req.body;

    // Check admin secret for security
    const ADMIN_SECRET = process.env.ADMIN_SECRET || 'MySuperSecretKey123!';
    
    if (adminSecret !== ADMIN_SECRET) {
      return res.status(403).json({ success: false, message: 'Invalid admin secret' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create admin user
    const user = await User.create({
      name,
      email,
      password,
      role: 'admin',
    });

    console.log('Admin registered:', user.name, user.email);

    if (user) {
      // Generate token
      const token = generateToken(user._id);

      // Format response
      const userResponse = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      res.status(201).json({
        success: true,
        message: 'Admin registered successfully',
        token: token,
        user: userResponse,
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
