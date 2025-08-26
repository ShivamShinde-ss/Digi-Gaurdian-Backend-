// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const userRoutes = require('./routes/userRoutes'); // Import your user routes
const formRoutes = require("./routes/formRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---
app.use(cors()); // Allows cross-origin requests (from your frontend)
app.use(express.json()); // Parses incoming JSON requests

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));


// --- API Routes ---
// This tells the app to use your userRoutes for any request that starts with /api/users
app.use('/api/users', userRoutes);
app.use("/api/form", formRoutes);


// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});