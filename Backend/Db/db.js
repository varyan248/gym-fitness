require("dotenv").config();
const mongoose = require('mongoose');

const connectDb = async() => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/GymManagement");
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Error connecting to database", error);
    }
}

module.exports = connectDb