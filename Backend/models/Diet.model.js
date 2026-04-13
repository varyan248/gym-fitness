const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  items: [String],
  calories: {
    type: Number,
    default: 0,
  },
  instructions: {
    type: String,
  },
});

const dietSchema = new mongoose.Schema(
  {
    goal: {
      type: String,
      enum: ['Weight Loss', 'Muscle Gain', 'Stay Fit'],
      required: true,
    },
    breakfast: mealSchema,
    lunch: mealSchema,
    dinner: mealSchema,
    snacks: mealSchema,
    waterIntake: {
      type: Number,
      default: 8,
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

module.exports = mongoose.model('Diet', dietSchema);