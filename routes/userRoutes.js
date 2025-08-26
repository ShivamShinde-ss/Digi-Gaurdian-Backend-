// backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Import the User model

// --- REGISTRATION ROUTE ---
// Path: POST /api/users/register
router.post('/register', async (req, res) => {
  try {
    const { first, last, email, username, password, mobile, gender } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists.' });
    }

    // Create a new user instance (password will be hashed by the pre-save hook in the model)
    const newUser = new User({
      firstName: first,
      lastName: last,
      email,
      username,
      password,
      mobile,
      gender,
    });

    // Save the user to the database
    await newUser.save();

    // Send a success response
    res.status(201).json({ message: 'Registration successful! Please log in.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});


// --- LOGIN ROUTE ---
// Path: POST /api/users/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by their username
    const user = await User.findOne({ username: username.toLowerCase() });

    // If user not found, or if password doesn't match, send error
    // We use a general message to avoid telling attackers whether the username or password was wrong
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // If login is successful
    res.status(200).json({ message: 'Login successful! Welcome back.' });
    
    // In a real application, you would generate a JWT (JSON Web Token) here for session management

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

module.exports = router;