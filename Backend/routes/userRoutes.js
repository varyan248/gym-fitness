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
    const user = await User.findById(req.user._id);
    
    if (user) {
      user.name = req.body.name || user.name;
      user.age = req.body.age || user.age;
      user.height = req.body.height || user.height;
      user.weight = req.body.weight || user.weight;
      user.goal = req.body.goal || user.goal;
      
      const updatedUser = await user.save();
      
      res.json({
        success: true,
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          age: updatedUser.age,
          height: updatedUser.height,
          weight: updatedUser.weight,
          goal: updatedUser.goal,
        },
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/users/today-workout
// @desc    Get today's workout
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
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/users/diet-plan
// @desc    Get diet plan based on user goal
router.get('/diet-plan', protect, async (req, res) => {
  try {
    const diet = await Diet.findOne({ goal: req.user.goal });
    res.json({ success: true, diet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/users/weekly-workout
// @desc    Get weekly workout schedule
router.get('/weekly-workout', protect, async (req, res) => {
  try {
    const workouts = await Workout.find({
      $or: [{ goal: req.user.goal }, { goal: 'All' }],
    }).sort({ day: 1 });
    
    res.json({ success: true, workouts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;