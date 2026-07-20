const express = require("express");
const cloudinary = require("../config/cloudinary");
const Media = require("../models/Media");
const { protect } = require("../middleware/auth");
const asyncHandler = require("../middleware/asyncHandler");
const router = express.Router();

// GET /api/media?page=&limit=&search= (admin — danh sách ảnh đã tải lên để chọn dùng lại)
router.get("/", protect, asyncHandler(async (req, res) => {
  const { page = 1, limit = 40, search = "" } = req.query;
  const filter = search ? { filename: { $regex: search, $options: "i" } } : {};
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Media.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Media.countDocuments(filter),
  ]);
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / limit) });
}));

// DELETE /api/media/:id (admin — xoá khỏi thư viện, xoá luôn trên Cloudinary)
router.delete("/:id", protect, asyncHandler(async (req, res) => {
  const media = await Media.findById(req.params.id);
  if (!media) return res.status(404).json({ message: "Không tìm thấy ảnh" });
  try {
    await cloudinary.uploader.destroy(media.publicId);
  } catch (e) {
    console.error("Xoá ảnh trên Cloudinary thất bại (bỏ qua, vẫn xoá khỏi thư viện):", e.message);
  }
  await media.deleteOne();
  res.json({ message: "Đã xoá" });
}));

module.exports = router;
