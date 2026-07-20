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
    // ảnh trong thư viện: mỗi ảnh có thể chỉ là URL (dữ liệu cũ) hoặc {url, caption} (có chú thích) —
    // để Mixed cho không bị lỗi ép kiểu với dữ liệu cũ đã lưu dạng chuỗi từ trước
    images: [mongoose.Schema.Types.Mixed],
    // Vật liệu sử dụng trong dự án, hiện cho khách xem ở trang chi tiết
    materials: [
      {
        name: { type: String, required: true },
        description: { type: String, default: "" },
        image: { type: String, default: "" },
      },
    ],
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
