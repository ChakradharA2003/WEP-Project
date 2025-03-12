const mongoose = require('mongoose'); // Import Mongoose for MongoDB interaction

// Define the User schema
const userSchema = new mongoose.Schema({
  firstName: String, // First name of the user
  lastName: String,  // Last name of the user
  email: { type: String, required: true, unique: true }, // Unique email for authentication
  mobile: { type: String, required: true, unique: true }, // Unique mobile number for authentication
  password: { type: String, required: true }, // Hashed password for security
  otp: String, // OTP for authentication
  otpExpiry: Date, // Expiry time for OTP
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },  // GeoJSON type
    coordinates: { type: [Number], index: "2dsphere", default: [0, 0] },  // [longitude, latitude]
  },
});

// Export the User model
module.exports = mongoose.model('User', userSchema);
