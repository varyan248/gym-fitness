const mongoose = require('mongoose');
const User = require('../models/user.model.js');

const resetPassword = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/GymManagement");
        
        const email = 'admin@gym.com';
        const newPassword = 'Admin@123'; // Change this to whatever they want if needed
        
        const user = await User.findOne({ email });
        if (!user) {
            console.error(`User with email ${email} not found.`);
            process.exit(1);
        }

        user.password = newPassword;
        await user.save();
        
        console.log(`Password for ${email} has been successfully reset to: ${newPassword}`);
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('Error resetting password:', err);
        process.exit(1);
    }
};

resetPassword();
