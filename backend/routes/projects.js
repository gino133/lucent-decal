const express = require("express");
const slugify = require("slugify");
const Project = require("../models/Project");
const { protect } = require("../middleware/auth");
const { resolveCategoryId } = require("../utils/resolveCategoryFilter");
const router = express.Router();

router.get("/", async (req, res) => {
  const { category, featured, page = 1, limit = 12 } = req.query;
  const filter = { isPublished: true };

  if (category) {
    const categoryId = await resolveCategoryId(category);
    if (!categoryId) return res.json({ items: [], total: 0, page: Number(page), pages: 0 });
    filter.category = categoryId;
  }
  if (featured) filter.isFeatured = true;
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Project.find(filter).populate("category").sort({ order: 1, createdAt: -1 }).skip(skip).limit(Number(limit)),
    Project.countDocuments(filter),
  ]);
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / limit) });
});

router.get("/:slug", async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug }).populate("category");
  if (!project) return res.status(404).json({ message: "Không tìm thấy dự án" });
  res.json(project);
});

router.get("/admin/all", protect, async (req, res) => {
  const items = await Project.find().populate("category").sort({ createdAt: -1 });
  res.json(items);
});

router.post("/", protect, async (req, res) => {
  const slug = req.body.slug || slugify(req.body.name, { lower: true, locale: "vi" });
  const project = await Project.create({ ...req.body, slug });
  res.status(201).json(project);
});

router.put("/:id", protect, async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(project);
});

router.delete("/:id", protect, async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: "Đã xoá" });
});

module.exports = router;
