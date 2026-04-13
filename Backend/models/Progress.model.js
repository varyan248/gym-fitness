// const mongoose = require('mongoose');

// const progressSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     weight: {
//       type: Number,
//       required: true,
//     },
//     bmi: {
//       type: Number,
//     },
//     bodyFat: {
//       type: Number,
//     },
//     date: {
//       type: Date,
//       default: Date.now,
//     },
//     notes: {
//       type: String,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Calculate BMI before saving
// progressSchema.pre('save', function (next) {
//   if (this.weight && this.user) {
//     // BMI calculation will be done when we have user's height
//     next();
//   } else {
//     next();
//   }
// });

// module.exports = mongoose.model('Progress', progressSchema);


// backend/models/Progress.model.js
const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  bodyFat: {
    type: Number,
    default: null
  },
  bmi: {
    type: Number,
    default: null
  },
  notes: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Progress', progressSchema);