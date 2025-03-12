const express = require('express'); // Import Express
const mongoose = require('mongoose'); // Import Mongoose for database connection
const dotenv = require('dotenv'); // Import dotenv to handle environment variables
const authRoutes = require('./routes/authRoutes'); // Import authentication routes
const cors = require('cors'); // Enable CORS for cross-origin requests
const http = require("http"); // Required to create the server
// const { initSocket } = require("./socket"); // Import WebSocket initializer

dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

const server = http.createServer(app);
// initSocket(server);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Use authentication routes
app.use(authRoutes);


// Start the Express server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
