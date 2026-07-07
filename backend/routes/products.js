const express = require("express");
const slugify = require("slugify");
const Product = require("../models/Product");
const { protect } = require("../middleware/auth");
const router = express.Router();

// GET /api/products?category=&search=&featured=&page=&limit=
router.get("/", async (req, res) => {
  const { category, search, featured, page = 1, limit = 16 } = req.query;
  const filter = { isPublished: true };
  if (category) filter.category = category;
  if (featured) filter.isFeatured = true;
  if (search) filter.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Product.find(filter).populate("category").sort({ order: 1, createdAt: -1 }).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter),
  ]);
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / limit) });
});

router.get("/:slug", async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate("category");
  if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
  res.json(product);
});

// ---- Admin ----
router.get("/admin/all", protect, async (req, res) => {
  const items = await Product.find().populate("category").sort({ createdAt: -1 });
  res.json(items);
});

router.post("/", protect, async (req, res) => {
  const slug = req.body.slug || slugify(req.body.name, { lower: true, locale: "vi" });
  const product = await Product.create({ ...req.body, slug });
  res.status(201).json(product);
});

router.put("/:id", protect, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
});

router.delete("/:id", protect, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Đã xoá" });
});

module.exports = router;
