const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    name: { type: String, required: true },
    email: { type: String, default: "" },
    content: { type: String, required: true },
    // Bình luận mặc định ở trạng thái chờ duyệt để tránh spam hiển thị công khai ngay
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
