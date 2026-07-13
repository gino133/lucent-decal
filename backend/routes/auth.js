const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/auth");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

function signToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

// POST /api/auth/login
router.post("/login", asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() });
  if (!user) return res.status(401).json({ message: "Sai email hoặc mật khẩu" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Sai email hoặc mật khẩu" });

  const token = signToken(user);
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
}));

// GET /api/auth/me
router.get("/me", protect, asyncHandler(async (req, res) => {
  res.json({ user: req.user });
}));

// PUT /api/auth/change-password
router.put("/change-password", protect, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  const match = await bcrypt.compare(currentPassword, user.password);
  if (!match) return res.status(400).json({ message: "Mật khẩu hiện tại không đúng" });
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: "Đổi mật khẩu thành công" });
}));

module.exports = router;
