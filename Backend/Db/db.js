// require("dotenv").config();
// const mongoose = require('mongoose');

// const connectDb = async() => {
//     try {
//         await mongoose.connect("process.env.MONGO_URI/GymManagement");
//         console.log("Database connected successfully");
//     } catch (error) {
//         console.error("Error connecting to database", error);
//     }
// }

// module.exports = connectDb

require("dotenv").config();
const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        const uri = process.env.MONGO_URI;

        if (!uri) {
            throw new Error("MONGO_URI is not defined ❌");
        }

        const conn = await mongoose.connect(uri);

        console.log(`Database connected successfully: ${conn.connection.host} ✅`);
    } catch (error) {
        console.error("Error connecting to database ❌", error.message);
        process.exit(1);
    }
};

module.exports = connectDb;