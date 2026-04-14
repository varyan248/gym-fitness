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

// @route   POST /api/admin/users/bulk-delete
// @desc    Delete multiple users
// @access  Private/Admin
router.post('/users/bulk-delete', protect, admin, async (req, res) => {
  try {
    const { userIds } = req.body;
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ success: false, message: 'No users selected' });
    }
    
    // Safety check to ensure admin doesn't delete themselves
    const adminId = req.user._id.toString();
    if (userIds.includes(adminId)) {
      return res.status(403).json({ success: false, message: 'Cannot delete your own admin account in a bulk operation' });
    }
    
    // Only delete users that are not the current admin
    await User.deleteMany({
      _id: { $in: userIds },
      role: { $ne: 'admin' } // optional: prevent bulk deleting any admin
    });
    
    res.json({ success: true, message: 'Users removed successfully' });
  } catch (error) {
    console.error('Error bulk deleting users:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/users/:id/plan
// @desc    Update a user's subscription plan
// @access  Private/Admin
router.put('/users/:id/plan', protect, admin, async (req, res) => {
  try {
    const { plan, durationMonths } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    if (!plan) {
      return res.status(400).json({ success: false, message: 'Plan name is required' });
    }

    if (plan === 'None' || !durationMonths || durationMonths <= 0) {
      user.plan = 'None';
      user.isPlanActive = false;
      user.planStartDate = null;
      user.planEndDate = null;
    } else {
      user.plan = plan;
      user.isPlanActive = true;
      user.planStartDate = new Date();
      
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + parseInt(durationMonths));
      user.planEndDate = endDate;
    }

    await user.save();
    
    res.json({ success: true, message: 'User plan updated successfully', user });
  } catch (error) {
    console.error('Error updating plan:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
