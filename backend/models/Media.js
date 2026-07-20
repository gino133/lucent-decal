const mongoose = require("mongoose");

// lưu lại mọi ảnh đã tải lên để admin chọn dùng lại, khỏi phải tải trùng lặp nhiều lần
const mediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    filename: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Media", mediaSchema);
