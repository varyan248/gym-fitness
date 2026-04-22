const mongoose = require('mongoose');
const path = require('path');
const User = require('../models/user.model.js');

const findAdmins = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/GymManagement");
        const admins = await User.find({ role: 'admin' }).select('email name');
        console.log('---ADMIN_LIST_START---');
        console.log(JSON.stringify(admins));
        console.log('---ADMIN_LIST_END---');
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

findAdmins();
