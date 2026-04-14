const express = require('express');
const router = express.Router();
const User = require('../models/user.model.js');
const { protect, admin } = require('../middleware/Auth.js');

// @route   GET /api/admin/users
// @desc    Get all users data
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user
// @access  Private/Admin
router.delete('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Optional: Prevent admins from deleting themselves or other admins, depending on business rules.
    if (user.role === 'admin' && req.user._id.toString() !== user._id.toString()) {
         return res.status(403).json({ success: false, message: 'Cannot delete another admin' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User removed successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
