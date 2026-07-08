const express = require("express");
const Page = require("../models/Page");
const { protect } = require("../middleware/auth");
const router = express.Router();

// GET /api/pages/:slug (public)
router.get("/:slug", async (req, res) => {
  const page = await Page.findOne({ slug: req.params.slug, isPublished: true });
  if (!page) return res.status(404).json({ message: "Không tìm thấy trang" });
  res.json(page);
});

// GET /api/pages (admin - danh sách toàn bộ để quản lý)
router.get("/", protect, async (req, res) => {
  const pages = await Page.find().sort({ slug: 1 });
  res.json(pages);
});

// GET /api/pages/admin/:slug (admin - lấy cả khi chưa publish)
router.get("/admin/:slug", protect, async (req, res) => {
  const page = await Page.findOne({ slug: req.params.slug });
  res.json(page);
});

// PUT /api/pages/:slug (admin - tạo hoặc cập nhật toàn bộ block của trang)
router.put("/:slug", protect, async (req, res) => {
  let page = await Page.findOne({ slug: req.params.slug });
  if (!page) {
    page = new Page({ slug: req.params.slug, title: req.body.title || req.params.slug });
  }
  Object.assign(page, req.body);
  await page.save();
  res.json(page);
});

// DELETE /api/pages/:slug (admin - xoá hẳn một trang tuỳ chỉnh)
router.delete("/:slug", protect, async (req, res) => {
  const page = await Page.findOneAndDelete({ slug: req.params.slug });
  if (!page) return res.status(404).json({ message: "Không tìm thấy trang" });
  res.json({ message: "Đã xoá trang" });
});

module.exports = router;
