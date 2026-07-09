const express = require("express");
const { runSeed } = require("../utils/seedData");
const router = express.Router();

// GET /api/seed?key=SEED_KEY&force=true&resetPassword=true
router.get("/", async (req, res) => {
  try {
    if (!process.env.SEED_KEY) {
      return res.status(403).json({
        message: "Chưa cấu hình SEED_KEY trên server. Vào Render → Environment → thêm biến SEED_KEY rồi thử lại.",
      });
    }
    if (req.query.key !== process.env.SEED_KEY) {
      return res.status(401).json({ message: "Sai khoá bí mật (key)." });
    }

    const force = req.query.force === "true";
    const resetPassword = req.query.resetPassword === "true";
    const log = await runSeed({ force, resetPassword });
    res.json({ success: true, force, resetPassword, log });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
