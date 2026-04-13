const express = require('express');
const router = express.Router();
const Workout = require('../models/workout.model.js');
const { protect, admin } = require('../middleware/Auth.js');

// @route   GET /api/workouts
// @desc    Get all workouts (public)
router.get('/', async (req, res) => {
  try {
    const workouts = await Workout.find();
    res.json({ success: true, workouts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/workouts/:id
// @desc    Get single workout
router.get('/:id', async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }
    res.json({ success: true, workout });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin routes
// @route   POST /api/workouts
// @desc    Create workout (admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const workout = await Workout.create(req.body);
    res.status(201).json({ success: true, workout });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/workouts/:id
// @desc    Update workout (admin only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const workout = await Workout.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }
    
    res.json({ success: true, workout });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/workouts/:id
// @desc    Delete workout (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const workout = await Workout.findByIdAndDelete(req.params.id);
    
    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }
    
    res.json({ success: true, message: 'Workout deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;