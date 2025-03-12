const User = require('../models/User');
const ServiceProvider = require('../models/ServiceProvider');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
// const { getIo } = require("../socket"); // Import WebSocket instance safely
// const io = getIo(); // Get WebSocket instance when needed
// const { getIo } = require("../socket"); // Import WebSocket instance safely

// Function to send OTP
const sendOtp = async (email, UserModel) => {
  const otpNum = crypto.randomInt(100000, 999999).toString();
  const user = await UserModel.findOneAndUpdate(
    { email },
    { otp: otpNum, otpExpiry: new Date(Date.now() + 5 * 60 * 1000) }, // OTP expires in 5 minutes
    { new: true, upsert: true }
  );

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, // Allow self-signed certificates (not recommended for production)
    },
  });

  const sendMail = (to, sub, msg) => {
    transporter.sendMail({
      to: to,
      subject: sub,
      text: msg,
    }, (err, info) => {
      if (err) {
        // console.error('Error sending OTP email:', err);
        throw new Error('Failed to send OTP');
       } 
      //  else {
      //   console.log('OTP sent:', info);
      // }
    });
  };

  sendMail(email, 'OTP Account Verification', `Your OTP is ${otpNum}. It will expire in 5 minutes.`);
  return { status: 200, message: 'OTP sent successfully' };
};

// Function to verify OTP
const verifyOtp = async (email, otp, UserModel) => {
  const user = await UserModel.findOne({ email, otp });
  if (!user || user.otpExpiry < new Date()) {
    throw new Error('Invalid or expired OTP');
  }

  user.otp = ''; // Clear the OTP after verification
  user.otpExpiry = undefined; // Clear the OTP expiry after verification
  await user.save();
  return user;
};

// User Sign Up
exports.userSignUp = async (req, res) => {
  const { firstName, lastName, email, mobile, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      firstName,
      lastName,
      email,
      mobile,
      password: hashedPassword,
    });

    await newUser.save();
    
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error signing up user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// User Send OTP
exports.userSendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const result = await sendOtp(email, User);
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// User Verify OTP
exports.userVerifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await verifyOtp(email, otp, User);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5d' });
    res.status(200).json({ user,token });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(400).json({ message: error.message });
  }
};

// SP Sign Up
exports.spSignUp = async (req, res) => {
  const { name, email, mobile, address, service, password } = req.body;
  try {
    const existingSP = await ServiceProvider.findOne({ email });
    if (existingSP) {
      return res.status(400).json({ message: 'Service provider already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newSP = new ServiceProvider({
      name,
      email,
      mobile,
      address,
      service,
      password: hashedPassword,
    });
    await newSP.save();
    
    res.status(201).json({ message: 'User created successfully' });

  } catch (error) {
    console.error('Error signing up service provider:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// SP Send OTP
exports.spSendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const result = await sendOtp(email, ServiceProvider);
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// SP Verify OTP
exports.spVerifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const sp = await verifyOtp(email, otp, ServiceProvider);
    const token = jwt.sign({ id: sp._id }, process.env.JWT_SECRET, { expiresIn: '5d' });
    res.status(200).json({ sp, token });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(400).json({ message: error.message });
  }
};

// SP Sign In
exports.spSignIn = async (req, res) => {
  const { mobile, password } = req.body;

  try {
    let sp = await ServiceProvider.findOne({ mobile });
    if (!sp) {
      return res.status(400).json({ message: 'Please enter valid mobile number' });
    }

    const isMatch = await bcrypt.compare(password, sp.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: sp.id,
      },
    };

    // sp.location = { type: "Point", coordinates: [longitude, latitude] };
    // await sp.save();

    // ✅ Send real-time location update via WebSocket (Only if io is initialized)
    // const io = getIo();
    // if (io) {
    //   io.emit("locationUpdated", { userId: sp._id, latitude, longitude });
    // }
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5d' }, (err, token) => {
      if (err) throw err;
      const user = { name: sp.name, email: sp.email, mobile: sp.mobile, address: sp.address, service: sp.service };
      res.status(201).json({ token, user });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// User Sign In
exports.userSignIn = async (req, res) => {
  const { mobile, password, latitude, longitude } = req.body;

  try {
    let checkUser = await User.findOne({ mobile });
    if (!checkUser) {
      return res.status(400).json({ message: "Please enter a valid mobile number" });
    }

    const isMatch = await bcrypt.compare(password, checkUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ Update the user's location in the database
    // if (latitude && longitude) {
    //   checkUser.location = {
    //     type: "Point",
    //     coordinates: [longitude, latitude], // MongoDB uses [longitude, latitude] format
    //   };
    //   await checkUser.save();
    // }

    const payload = {
      user: {
        id: checkUser.id,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5d" }, (err, token) => {
      if (err) throw err;
      const user = {
        firstName: checkUser.firstName,
        lastName: checkUser.lastName,
        email: checkUser.email,
        mobile: checkUser.mobile,
        location: checkUser.location, // ✅ Include updated location in the response
      };
      res.status(201).json({ token, user });
    });
  } catch (error) {
    console.error("❌ Error in userSignIn:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// User Create New Password
exports.userCreateNewPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Please enter valid email' });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.otp = "";
    user.otpExpiry = "";
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// SP Create New Password
exports.spCreateNewPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    let sp = await ServiceProvider.findOne({ email });
    if (!sp) {
      return res.status(400).json({ message: 'Please enter valid email' });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    sp.password = hashedPassword;
    sp.otp = "";
    sp.otpExpiry = "";
    await sp.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};



// ⭐ API to Rate a Service Provider ⭐
exports.rateServiceProvider = async (req, res) => {
  try {
    const { providerId, rating } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const provider = await ServiceProvider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: "Service provider not found" });
    }

    // Add rating and calculate new average
    provider.ratings.push(rating);
    const avgRating = provider.getAverageRating();

    // Auto-delete provider if their average rating falls below 2 stars after at least 10 ratings
    if (provider.ratings.length >= 10 && avgRating < 2) {
      await ServiceProvider.findByIdAndDelete(providerId);
      return res.json({ message: "Service provider removed due to low ratings." });
    }

    await provider.save();
    res.json({ message: "Rating submitted successfully!", avgRating });
  } catch (error) {
    console.error("Error rating service provider:", error);
    res.status(500).json({ message: "Server error" });
  }
};
