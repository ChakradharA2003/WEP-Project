const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// User Routes
router.post('/users/signup', authController.userSignUp);
router.post('/users/send-otp', authController.userSendOTP);
router.post('/users/verify-otp', authController.userVerifyOTP);
router.post('/users/signin', authController.userSignIn);
router.post('/users/forgot-password', authController.userSendOTP);
router.post('/users/create-new-password', authController.userCreateNewPassword);

// Service Provider Routes
router.post('/sps/signup', authController.spSignUp);
router.post('/sps/send-otp', authController.spSendOTP);
router.post('/sps/verify-otp', authController.spVerifyOTP);
router.post('/sps/signin', authController.spSignIn);
router.post('/sps/forgot-password', authController.spSendOTP);
router.post('/sps/create-new-password', authController.spCreateNewPassword);
router.post("/providers/rate", authController.rateServiceProvider);

module.exports = router;