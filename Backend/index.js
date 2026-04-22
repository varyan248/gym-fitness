const express = require('express');
const mongoose = require('mongoose');
const connectDB = require("./Db/db.js");
// const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
connectDB();
const app = express();

const cors = require("cors");

const allowedOrigins = [
  "http://localhost:5173",
  "https://gym-fitness-8doj.vercel.app",
  "https://gym-fitness-git-main-aryans-projects-539b3387.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ✅ handle preflight
app.options("*", cors());

// Middleware

// app.use(cors({
//   origin: [
//     "http://localhost:5173",
//     "https://gym-fitness-8doj.vercel.app",
//     "https://gym-fitness-git-main-aryans-projects-539b3387.vercel.app"
//   ],
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   credentials: true
// }));

// app.use(cors({
//   origin: [
//     "http://localhost:5173",
//     "https://gym-fitness-8doj.vercel.app",
//     "https://gym-fitness-git-main-aryans-projects-539b3387.vercel.app"
//   ],
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   credentials: true
// }));

app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const workoutRoutes = require('./routes/workoutRoutes.js');
const dietRoutes = require('./routes/dietRoutes.js');
const progressRoutes = require('./routes/progressRoutes.js');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/diets', dietRoutes);
app.use('/api/progress', progressRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});