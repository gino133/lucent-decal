const express = require("express");
const slugify = require("slugify");
const Post = require("../models/Post");
const { protect } = require("../middleware/auth");
const { resolveCategoryId } = require("../utils/resolveCategoryFilter");
const asyncHandler = require("../middleware/asyncHandler");
const router = express.Router();

// GET /api/posts?category=&tag=&search=&featured=&page=&limit=
router.get("/", asyncHandler(async (req, res) => {
  const { category, tag, search, featured, page = 1, limit = 9 } = req.query;
  const filter = { isPublished: true };

  if (category) {
    const categoryId = await resolveCategoryId(category);
    if (!categoryId) return res.json({ items: [], total: 0, page: Number(page), pages: 0 });
    filter.category = categoryId;
  }
  if (tag) filter.tags = tag;
  if (featured) filter.isFeatured = true;
  if (search) filter.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Post.find(filter).populate("category").sort({ publishedAt: -1 }).skip(skip).limit(Number(limit)),
    Post.countDocuments(filter),
  ]);
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / limit) });
}));

// GET /api/posts/:slug (public - tự tăng lượt xem)
router.get("/:slug", asyncHandler(async (req, res) => {
  const post = await Post.findOneAndUpdate(
    { slug: req.params.slug, isPublished: true },
    { $inc: { views: 1 } },
    { new: true }
  ).populate("category");
  if (!post) return res.status(404).json({ message: "Không tìm thấy bài viết" });
  res.json(post);
}));

// ---- Admin ----
router.get("/admin/all", protect, asyncHandler(async (req, res) => {
  const items = await Post.find().populate("category").sort({ createdAt: -1 });
  res.json(items);
}));

router.post("/", protect, asyncHandler(async (req, res) => {
  const slug = req.body.slug || slugify(req.body.title, { lower: true, locale: "vi" });
  const post = await Post.create({ ...req.body, slug });
  res.status(201).json(post);
}));

router.put("/:id", protect, asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(post);
}));

router.delete("/:id", protect, asyncHandler(async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: "Đã xoá" });
}));

module.exports = router;
