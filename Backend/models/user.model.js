// // User.model.js
// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, unique: true, required: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ["user", "admin"], default: "user" },
//   profile: {
//     age: Number,
//     height: Number,
//     weight: Number,
//     goal: { type: String, enum: ["Weight Loss", "Muscle Gain"] },
//   },
// });

// const User = mongoose.model("User", userSchema);

// module.exports = User;

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    age: {
      type: Number,
    },
    height: {
      type: Number,
    },
    weight: {
      type: Number,
    },
    goal: {
      type: String,
      enum: ['Weight Loss', 'Muscle Gain', 'Stay Fit'],
      default: 'Stay Fit',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

