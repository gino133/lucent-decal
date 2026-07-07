const express = require("express");
const Setting = require("../models/Setting");
const { protect } = require("../middleware/auth");
const router = express.Router();

// GET /api/settings  (public - frontend dùng để lấy theme, logo, thông tin liên hệ)
router.get("/", async (req, res) => {
  let setting = await Setting.findOne();
  if (!setting) setting = await Setting.create({});
  res.json(setting);
});

// PUT /api/settings (admin)
router.put("/", protect, async (req, res) => {
  let setting = await Setting.findOne();
  if (!setting) setting = new Setting();
  Object.assign(setting, req.body);
  await setting.save();
  res.json(setting);
});

module.exports = router;
