const express = require("express");
const slugify = require("slugify");
const Category = require("../models/Category");
const { protect } = require("../middleware/auth");
const router = express.Router();

router.get("/", async (req, res) => {
  const filter = {};
  if (req.query.type) filter.type = req.query.type;
  const cats = await Category.find(filter).sort({ order: 1 });
  res.json(cats);
});

router.post("/", protect, async (req, res) => {
  const slug = req.body.slug || slugify(req.body.name, { lower: true, locale: "vi" });
  const cat = await Category.create({ ...req.body, slug });
  res.status(201).json(cat);
});

router.put("/:id", protect, async (req, res) => {
  const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(cat);
});

router.delete("/:id", protect, async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Đã xoá" });
});

module.exports = router;
