const express = require("express");
const router = express.Router();
const userController = require("../controllers/User.controller");
const { protect } = require("../middleware/auth");

// Public routes
router.post("/signup", userController.signup);
router.get("/verify-email", userController.verifyEmail);
router.post("/login", userController.login);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);

// Protected route
router.get("/me", protect, userController.getProfile);

module.exports = router;
