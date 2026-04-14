const express = require('express');
const router = express.Router();
const User = require('../models/user.model.js');
const Progress = require('../models/Progress.model.js');
const Workout = require('../models/workout.model.js');
const Diet = require('../models/Diet.model.js');
const { protect } = require('../middleware/Auth.js');

// @route   PUT /api/users/profile
// @desc    Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    console.log('Updating user:', req.user._id);
    console.log('Update data:', req.body);
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Update fields if provided (with type conversion)
    if (req.body.name !== undefined && req.body.name !== null) {
      user.name = String(req.body.name);
    }
    if (req.body.age !== undefined && req.body.age !== null) {
      user.age = req.body.age === '' ? null : Number(req.body.age);
    }
    if (req.body.height !== undefined && req.body.height !== null) {
      user.height = req.body.height === '' ? null : Number(req.body.height);
    }
    if (req.body.weight !== undefined && req.body.weight !== null) {
      user.weight = req.body.weight === '' ? null : Number(req.body.weight);
    }
    if (req.body.goal !== undefined && req.body.goal !== null) {
      user.goal = req.body.goal;
    }
    
    // Save the user (this will trigger pre('save') middleware)
    const updatedUser = await user.save();
    
    // Return updated user data (excluding password)
    const userResponse = {
      _id: updatedUser._id,
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      age: updatedUser.age,
      height: updatedUser.height,
      weight: updatedUser.weight,
      goal: updatedUser.goal,
      role: updatedUser.role,
      plan: updatedUser.plan,
      planStartDate: updatedUser.planStartDate,
      planEndDate: updatedUser.planEndDate,
      isPlanActive: updatedUser.isPlanActive,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    };
    
    res.json({
      success: true,
      user: userResponse,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error occurred' 
    });
  }
});

// @route   GET /api/users/today-workout
router.get('/today-workout', protect, async (req, res) => {
  try {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    
    const workout = await Workout.findOne({
      day: today,
      $or: [{ goal: req.user.goal }, { goal: 'All' }],
    });
    
    res.json({ success: true, workout });
  } catch (error) {
    console.error('Error fetching today workout:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/users/diet-plan
router.get('/diet-plan', protect, async (req, res) => {
  try {
    const diet = await Diet.findOne({ goal: req.user.goal });
    res.json({ success: true, diet });
  } catch (error) {
    console.error('Error fetching diet plan:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/users/weekly-workout
router.get('/weekly-workout', protect, async (req, res) => {
  try {
    const workouts = await Workout.find({
      $or: [{ goal: req.user.goal }, { goal: 'All' }],
    }).sort({ day: 1 });
    
    res.json({ success: true, workouts });
  } catch (error) {
    console.error('Error fetching weekly workout:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/users/buy-plan
router.post('/buy-plan', protect, async (req, res) => {
  try {
    const { plan } = req.body;
    
    if (!['1 Month', '6 Months', '1 Year'].includes(plan)) {
      return res.status(400).json({ success: false, message: 'Invalid plan selected' });
    }
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const startDate = new Date();
    let endDate = new Date();
    
    if (plan === '1 Month') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (plan === '6 Months') {
      endDate.setMonth(endDate.getMonth() + 6);
    } else if (plan === '1 Year') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }
    
    user.plan = plan;
    user.planStartDate = startDate;
    user.planEndDate = endDate;
    user.isPlanActive = true;
    
    const updatedUser = await user.save();
    
    const userResponse = {
      _id: updatedUser._id,
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      plan: updatedUser.plan,
      planStartDate: updatedUser.planStartDate,
      planEndDate: updatedUser.planEndDate,
      isPlanActive: updatedUser.isPlanActive,
    };
    
    res.json({
      success: true,
      message: 'Plan purchased successfully',
      user: userResponse,
    });
  } catch (error) {
    console.error('Error buying plan:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;