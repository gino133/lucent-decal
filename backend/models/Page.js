const mongoose = require("mongoose");

const blockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "hero",          // banner lớn: title, subtitle, image, ctaText, ctaLink
        "richtext",      // đoạn văn bản HTML tự do
        "imageText",     // ảnh + chữ song song
        "gallery",       // lưới ảnh (bento như trang chủ)
        "stats",         // số liệu nổi bật (vd: 500+ dự án)
        "testimonial",   // đánh giá khách hàng
        "cta",           // kêu gọi hành động
        "team",          // danh sách thành viên
        "faq",           // câu hỏi thường gặp
        "logos",         // logo đối tác/khách hàng
        "featureCards",  // lưới thẻ nội dung tự nhập (không lấy từ DB)
        "productsFeatured", // hiển thị sản phẩm nổi bật (tự động lấy từ DB)
        "projectsFeatured", // hiển thị dự án nổi bật (tự động lấy từ DB)
        "postsFeatured", // hiển thị tin tức nổi bật (tự động lấy từ DB)
        "contactForm",
        "map",
      ],
    },
    order: { type: Number, default: 0 },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
    visible: { type: Boolean, default: true },
  },
  { _id: true }
);

const pageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true }, // home | gioi-thieu | ho-so-nang-luc | lien-he ...
    title: { type: String, required: true },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    blocks: [blockSchema],
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Page", pageSchema);
