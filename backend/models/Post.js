const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    excerpt: { type: String, default: "" }, // Mô tả ngắn hiện ở danh sách bài viết
    content: { type: String, default: "" }, // Nội dung HTML đầy đủ
    coverImage: { type: String, default: "" },
    tags: [{ type: String }],
    author: { type: String, default: "Admin" },
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

postSchema.index({ title: "text", excerpt: "text", content: "text" });

module.exports = mongoose.model("Post", postSchema);
