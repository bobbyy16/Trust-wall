const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const sendEmail = require("../utils/sendEmail");

const createToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @desc Signup new user
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Email already exists" });

    const verificationToken = crypto.randomBytes(32).toString("hex");

    // ✅ create new instance
    const user = new User({
      name,
      email,
      password,
      verificationToken,
      verificationTokenExpires: Date.now() + 60 * 60 * 1000, // 1 hour
    });

    // call save explicitly to trigger pre-save hook
    await user.save();

    const verifyLink = `${process.env.BACKEND_URL}/api/users/verify-email?token=${verificationToken}`;
    const html = `<p>Hello ${name},</p><p>Please verify your email by clicking <a href="${verifyLink}">here</a>.</p>`;

    await sendEmail(email, "Verify your email", html);

    res
      .status(201)
      .json({ message: "Signup successful. Please verify your email." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Verify email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified)
      return res.status(401).json({ message: "Please verify your email" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = createToken(user);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    const resetLink = `${process.env.BACKEND_URL}/api/users/reset-password?token=${resetToken}`;
    const html = `<p>Reset your password by clicking <a href="${resetLink}">here</a>. This link expires in 1 hour.</p>`;

    await sendEmail(user.email, "Password Reset Request", html);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get current user
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
