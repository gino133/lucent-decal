const express = require("express");
const upload = require("../middleware/upload");
const { protect } = require("../middleware/auth");
const asyncHandler = require("../middleware/asyncHandler");
const Media = require("../models/Media");
const router = express.Router();

// POST /api/upload  (form-data field: "image") -> trả về url Cloudinary, lưu luôn vào thư viện ảnh
router.post("/", protect, upload.single("image"), asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Không có file" });
  await Media.create({ url: req.file.path, publicId: req.file.filename, filename: req.file.originalname });
  res.json({ url: req.file.path, publicId: req.file.filename });
}));

// POST /api/upload/multiple
router.post("/multiple", protect, upload.array("images", 20), asyncHandler(async (req, res) => {
  const files = (req.files || []).map((f) => ({ url: f.path, publicId: f.filename, filename: f.originalname }));
  if (files.length) await Media.insertMany(files.map((f) => ({ url: f.url, publicId: f.publicId, filename: f.filename })));
  res.json({ files });
}));

module.exports = router;
