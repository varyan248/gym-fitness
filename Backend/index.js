const express = require('express');
const mongoose = require('mongoose');
const connectDB = require("./Db/db.js");
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
// Update CORS middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'https://your-frontend-url.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
// const adminRoutes = require('./routes/adminRoutes.js');
const workoutRoutes = require('./routes/workoutRoutes.js');
const dietRoutes = require('./routes/dietRoutes.js');
const progressRoutes = require('./routes/progressRoutes.js');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
// app.use('/api/admin', adminRoutes);
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