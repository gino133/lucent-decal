const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    client: { type: String, default: "" },
    location: { type: String, default: "" },
    year: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    images: [{ type: String }],
    // Cặp ảnh so sánh Trước/Sau, hiển thị dạng thanh trượt kéo được ở trang chi tiết dự án
    beforeAfterImages: [
      {
        before: { type: String, required: true },
        after: { type: String, required: true },
        caption: { type: String, default: "" },
      },
    ],
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
