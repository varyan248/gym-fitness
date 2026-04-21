// const jwt = require('jsonwebtoken');
// const User = require('../models/user.model.js');

// const protect = async (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer')
//   ) {
//     try {
//       token = req.headers.authorization.split(' ')[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = await User.findById(decoded.id).select('-password');
//       next();
//     } catch (error) {
//       console.error(error);
//       res.status(401).json({ success: false, message: 'Not authorized' });
//     }
//   }

//   if (!token) {
//     res.status(401).json({ success: false, message: 'Not authorized, no token' });
//   }
// };

// const admin = (req, res, next) => {
//   if (req.user && req.user.role === 'admin') {
//     next();
//   } else {
//     res.status(401).json({ success: false, message: 'Not authorized as admin' });
//   }
// };

// module.exports = { protect, admin };



// backend/middleware/Auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');

// Clean environment variable helper
const cleanEnvVar = (value) => {
  if (!value) return value;
  return value.trim().replace(/^["']|["']$/g, '').replace(/,/g, '');
};

const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      if (token) {
        token = token.trim().replace(/^["']|["']$/g, '');
      }
      
      const jwtSecret = cleanEnvVar(process.env.JWT_SECRET);
      
      if (!jwtSecret) {
        console.error('SERVER ERROR: JWT_SECRET is not defined');
        return res.status(500).json({ success: false, message: 'Server configuration error' });
      }
      
      const decoded = jwt.verify(token, jwtSecret);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        console.warn(`AUTH FAIL: User with ID ${decoded.id} not found in database`);
        return res.status(401).json({ success: false, message: 'User not found' });
      }
      
      if (user.isPlanActive && user.planEndDate && new Date() > user.planEndDate) {
        user.isPlanActive = false;
        user.plan = 'None';
        await user.save();
      }
      
      req.user = user;
      next();
    } catch (error) {
      console.error('AUTH FAIL: Token verification failed:', error.message);
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ success: false, message: 'Invalid token. Please login again.' });
      } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Token expired. Please login again.' });
      } else {
        return res.status(401).json({ success: false, message: 'Not authorized. Token failed.' });
      }
    }
  }
  
  if (!token) {
    console.warn('AUTH FAIL: No token provided in headers');
    return res.status(401).json({ success: false, message: 'Not authorized. No token provided.' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    console.warn(`AUTH FAIL: User ${req.user?.email} attempted admin access with role: ${req.user?.role}`);
    res.status(401).json({ success: false, message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, admin };