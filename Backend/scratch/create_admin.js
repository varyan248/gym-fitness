const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/user.model.js');

dotenv.config();

const createAdmin = async () => {
    try {
        console.log('🔄 Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected.');

        const adminData = {
            name: 'Gym Admin',
            email: 'admin@gym.com',
            password: 'AdminPassword123',
            role: 'admin',
            goal: 'Stay Fit'
        };

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log(`⚠️ Admin with email ${adminData.email} already exists.`);
            process.exit(0);
        }

        const admin = new User(adminData);
        await admin.save();

        console.log('--------------------------------------------------');
        console.log('🎉 ADMIN USER CREATED SUCCESSFULLY');
        console.log(`Email: ${adminData.email}`);
        console.log(`Password: ${adminData.password}`);
        console.log('--------------------------------------------------');
        
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('❌ Error creating admin:', err.message);
        process.exit(1);
    }
};

createAdmin();
