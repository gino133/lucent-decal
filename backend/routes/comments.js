const express = require("express");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const { protect } = require("../middleware/auth");
const router = express.Router();

// GET /api/comments/post/:postId (public - chỉ trả bình luận đã duyệt)
router.get("/post/:postId", async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId, status: "approved" }).sort({ createdAt: -1 });
  res.json(comments);
});

// POST /api/comments (public - gửi bình luận mới, mặc định chờ duyệt)
router.post("/", async (req, res) => {
  const { post, name, email, content } = req.body;
  if (!post || !name || !content) return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });

  const postExists = await Post.findById(post);
  if (!postExists) return res.status(404).json({ message: "Không tìm thấy bài viết" });

  const comment = await Comment.create({ post, name, email, content, status: "pending" });
  res.status(201).json({ comment, message: "Bình luận của bạn đã được gửi và đang chờ duyệt." });
});

// ---- Admin (kiểm duyệt) ----
router.get("/", protect, async (req, res) => {
  const comments = await Comment.find().populate("post", "title slug").sort({ createdAt: -1 });
  res.json(comments);
});

router.put("/:id", protect, async (req, res) => {
  const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(comment);
});

router.delete("/:id", protect, async (req, res) => {
  await Comment.findByIdAndDelete(req.params.id);
  res.json({ message: "Đã xoá" });
});

module.exports = router;
