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
  
  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      
      // Clean the token (remove any quotes or whitespace)
      if (token) {
        token = token.trim().replace(/^["']|["']$/g, '');
      }
      
      console.log('Token received:', token ? `Yes (length: ${token.length})` : 'No');
      
      // Get JWT secret and clean it
      const jwtSecret = cleanEnvVar(process.env.JWT_SECRET);
      
      if (!jwtSecret) {
        console.error('JWT_SECRET is not defined in environment variables');
        return res.status(500).json({ 
          success: false, 
          message: 'Server configuration error' 
        });
      }
      
      // Verify token
      const decoded = jwt.verify(token, jwtSecret);
      console.log('Token verified for user ID:', decoded.id);
      
      // Get user from database (excluding password)
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'User not found' 
        });
      }
      
      // Attach user to request object
      req.user = user;
      next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      
      // Send appropriate error message based on error type
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid token. Please login again.' 
        });
      } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false, 
          message: 'Token expired. Please login again.' 
        });
      } else {
        return res.status(401).json({ 
          success: false, 
          message: 'Not authorized. Token failed.' 
        });
      }
    }
  }
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized. No token provided.' 
    });
  }
};

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Not authorized as an admin' 
    });
  }
};

module.exports = { protect, admin };