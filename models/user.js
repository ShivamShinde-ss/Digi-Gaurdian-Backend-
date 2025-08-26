// backend/models/user.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Each email must be unique
    lowercase: true,
  },
  username: {
    type: String,
    required: true,
    unique: true, // Each username must be unique
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
});

// This function runs BEFORE a user document is saved to the database
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  // Hash the password with a cost factor of 12
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with the hashed password in the database
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;