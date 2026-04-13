const express = require('express');
const router = express.Router();
const User = require('../models/user.model.js');
const Workout = require('../models/workout.model.js');
const Diet = require('../models/Diet.model.js');
const Progress = require('../models/Progress.model.js');
const { protect, admin } = require('../middleware/Auth.js');

// All admin routes are protected with admin middleware
router.use(protect, admin);
// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const activeUsers = await User.countDocuments({ 
      role: 'user',
      lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    const totalWorkouts = await Workout.countDocuments();
    const totalDiets = await Diet.countDocuments();
    
    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        totalWorkouts,
        totalDiets,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user
router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Delete user's progress records
    await Progress.deleteMany({ user: req.params.id });
    
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get analytics data
router.get('/analytics', async (req, res) => {
  try {
    const userGrowth = await User.aggregate([
      { $match: { role: 'user' } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } },
      { $limit: 30 }
    ]);
    
    const engagement = await Progress.aggregate([
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        entries: { $sum: 1 }
      }},
      { $sort: { _id: 1 } },
      { $limit: 30 }
    ]);
    
    res.json({
      success: true,
      analytics: { userGrowth, engagement },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;