const mongoose = require('mongoose'); // Import Mongoose for database interaction

// Define the Service Provider schema
const serviceProviderSchema = new mongoose.Schema({
  name: String, // Name of the service provider
  email: { type: String, required: true, unique: true }, // Email for authentication
  mobile: { type: String, required: true, unique: true }, // Mobile number for login
  address: String, // Address of the provider
  service: { type: String, enum: ['water', 'electrician', 'plumber'], required: true }, // Type of service provided
  password: { type: String, required: true }, // Hashed password for authentication
  otp: String, // OTP for authentication
  otpExpiry: Date, // Expiry time for OTP
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },  // GeoJSON format
    coordinates: { type: [Number], index: "2dsphere", default: [0, 0] },  // [longitude, latitude]
  },
  // ⭐ New Fields for Ratings ⭐
  ratings: { type: [Number], default: [] }, // Stores all rating values
});

serviceProviderSchema.methods.getAverageRating = function () {
  if (this.ratings.length === 0) return 0;
  return this.ratings.reduce((sum, rating) => sum + rating, 0) / this.ratings.length;
};

// Export the Service Provider model
module.exports = mongoose.model('ServiceProvider', serviceProviderSchema);
