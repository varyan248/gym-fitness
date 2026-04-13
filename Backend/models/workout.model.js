const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sets: {
    type: Number,
    required: true,
  },
  reps: {
    type: String,
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    default: 0,
  },
});

const workoutSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true,
    },
    goal: {
      type: String,
      enum: ['Weight Loss', 'Muscle Gain', 'Stay Fit', 'All'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    exercises: [exerciseSchema],
    duration: {
      type: Number,
      default: 0,
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Workout', workoutSchema);