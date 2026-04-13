const express = require('express');
const router = express.Router();
const Diet = require('../models/Diet.model.js');
const { protect, admin } = require('../middleware/Auth.js');

// @route   GET /api/diets
// @desc    Get all diets
router.get('/', async (req, res) => {
  try {
    const diets = await Diet.find();
    res.json({ success: true, diets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/diets/:id
// @desc    Get single diet
router.get('/:id', async (req, res) => {
  try {
    const diet = await Diet.findById(req.params.id);
    if (!diet) {
      return res.status(404).json({ success: false, message: 'Diet plan not found' });
    }
    res.json({ success: true, diet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin routes
// @route   POST /api/diets
// @desc    Create diet plan (admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const diet = await Diet.create(req.body);
    res.status(201).json({ success: true, diet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/diets/:id
// @desc    Update diet plan (admin only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const diet = await Diet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!diet) {
      return res.status(404).json({ success: false, message: 'Diet plan not found' });
    }
    
    res.json({ success: true, diet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/diets/:id
// @desc    Delete diet plan (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const diet = await Diet.findByIdAndDelete(req.params.id);
    
    if (!diet) {
      return res.status(404).json({ success: false, message: 'Diet plan not found' });
    }
    
    res.json({ success: true, message: 'Diet plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;