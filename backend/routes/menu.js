const express = require("express");
const Menu = require("../models/Menu");
const { protect } = require("../middleware/auth");
const router = express.Router();

// GET /api/menu/:key (public) - key = main | footer
router.get("/:key", async (req, res) => {
  let menu = await Menu.findOne({ key: req.params.key });
  if (!menu) menu = await Menu.create({ key: req.params.key, items: [] });
  res.json(menu);
});

// PUT /api/menu/:key (admin) - cập nhật toàn bộ cây menu (kéo thả thứ tự từ admin UI)
router.put("/:key", protect, async (req, res) => {
  let menu = await Menu.findOne({ key: req.params.key });
  if (!menu) menu = new Menu({ key: req.params.key });
  menu.items = req.body.items;
  await menu.save();
  res.json(menu);
});

module.exports = router;
