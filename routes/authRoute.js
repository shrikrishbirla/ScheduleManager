const express = require('express');
const authController = require("../controllers/authControllers");
const mailer = require("../middleware/mailer");

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post("/forgot-password", mailer, authController.forgotPassword);
router.post("/verify-otp", mailer, authController.verifyOtp);
router.post("/reset-password", mailer, authController.resetPassword);
router.get('/logout', authController.logout);

module.exports = router;
