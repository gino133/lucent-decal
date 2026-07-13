const express = require("express");
const upload = require("../middleware/upload");
const { protect } = require("../middleware/auth");
const asyncHandler = require("../middleware/asyncHandler");
const router = express.Router();

// POST /api/upload  (form-data field: "image") -> trả về url Cloudinary
router.post("/", protect, upload.single("image"), asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Không có file" });
  res.json({ url: req.file.path, publicId: req.file.filename });
}));

// POST /api/upload/multiple
router.post("/multiple", protect, upload.array("images", 20), asyncHandler(async (req, res) => {
  const files = (req.files || []).map((f) => ({ url: f.path, publicId: f.filename }));
  res.json({ files });
}));

module.exports = router;
