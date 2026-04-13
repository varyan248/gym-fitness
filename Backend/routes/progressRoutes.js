// const express = require('express');
// const router = express.Router();
// const { protect } = require('../middleware/Auth');
// const Progress = require('../models/Progress.model');

// // Get all progress entries for logged-in user
// router.get('/', protect, async (req, res) => {
//   try {
//     const progress = await Progress.find({ user: req.user.id }).sort({ date: -1 });
//     res.json({ success: true, progress });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// // Get progress stats
// router.get('/stats', protect, async (req, res) => {
//   try {
//     const progress = await Progress.find({ user: req.user.id }).sort({ date: 1 });
    
//     if (progress.length === 0) {
//       return res.json({ 
//         success: true, 
//         stats: { 
//           startWeight: null, 
//           currentWeight: null, 
//           totalLost: 0 
//         } 
//       });
//     }
    
//     const startWeight = progress[0].weight;
//     const currentWeight = progress[progress.length - 1].weight;
//     const totalLost = startWeight - currentWeight;
    
//     res.json({ 
//       success: true, 
//       stats: { startWeight, currentWeight, totalLost } 
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// // Add progress entry
// router.post('/', protect, async (req, res) => {
//   try {
//     const { weight, bodyFat, notes } = req.body;
    
//     // Calculate BMI (assuming height is stored in user profile)
//     // You'll need to get user's height from User model
//     const bmi = null; // Calculate if you have height
    
//     const progress = await Progress.create({
//       user: req.user.id,
//       weight,
//       bodyFat: bodyFat || null,
//       bmi,
//       notes: notes || '',
//       date: new Date()
//     });
    
//     res.status(201).json({ success: true, progress });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// // Delete progress entry
// router.delete('/:id', protect, async (req, res) => {
//   try {
//     const progress = await Progress.findOneAndDelete({ 
//       _id: req.params.id, 
//       user: req.user.id 
//     });
    
//     if (!progress) {
//       return res.status(404).json({ success: false, message: 'Progress entry not found' });
//     }
    
//     res.json({ success: true, message: 'Progress entry deleted' });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// module.exports = router;

// backend/routes/progressRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/Auth.js');
const Progress = require('../models/Progress.model.js');

// Get all progress entries for logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user._id }).sort({ date: -1 });
    res.json({ success: true, progress });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get progress stats
router.get('/stats', protect, async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user._id }).sort({ date: 1 });
    
    if (progress.length === 0) {
      return res.json({ 
        success: true, 
        stats: { 
          startWeight: null, 
          currentWeight: null, 
          totalLost: 0 
        } 
      });
    }
    
    const startWeight = progress[0].weight;
    const currentWeight = progress[progress.length - 1].weight;
    const totalLost = startWeight - currentWeight;
    
    res.json({ 
      success: true, 
      stats: { startWeight, currentWeight, totalLost } 
    });
  } catch (error) {
    console.error('Error fetching progress stats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add progress entry
router.post('/', protect, async (req, res) => {
  try {
    const { weight, bodyFat, notes } = req.body;
    
    if (!weight) {
      return res.status(400).json({ success: false, message: 'Weight is required' });
    }
    
    // Calculate BMI if user has height
    let bmi = null;
    if (req.user.height) {
      const heightInMeters = req.user.height / 100;
      bmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
    }
    
    const progress = await Progress.create({
      user: req.user._id,
      weight: parseFloat(weight),
      bodyFat: bodyFat ? parseFloat(bodyFat) : null,
      bmi: bmi,
      notes: notes || '',
      date: new Date()
    });
    
    res.status(201).json({ success: true, progress });
  } catch (error) {
    console.error('Error adding progress:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete progress entry
router.delete('/:id', protect, async (req, res) => {
  try {
    const progress = await Progress.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!progress) {
      return res.status(404).json({ success: false, message: 'Progress entry not found' });
    }
    
    res.json({ success: true, message: 'Progress entry deleted' });
  } catch (error) {
    console.error('Error deleting progress:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;