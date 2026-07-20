const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: "Website của bạn" },
    tagline: { type: String, default: "Mô tả ngắn gọn về doanh nghiệp của bạn" },
    logoUrl: { type: String, default: "" },
    faviconUrl: { type: String, default: "" },
    // "text" = hiện tên thương hiệu, "logo" = hiện ảnh logo trên navbar
    brandDisplayMode: { type: String, enum: ["text", "logo"], default: "text" },

    // Theme màu sắc - map trực tiếp sang CSS variables / tailwind config phía frontend
    colors: {
      primary: { type: String, default: "#5f5f59" },
      secondary: { type: String, default: "#fae519" },
      background: { type: String, default: "#fbf9f9" },
      onBackground: { type: String, default: "#1b1c1c" },
      surface: { type: String, default: "#efeded" },
      outline: { type: String, default: "#777770" },
    },

    fonts: {
      heading: { type: String, default: "Montserrat" },
      body: { type: String, default: "Inter" },
    },

    contact: {
      phone: { type: String, default: "+84 (0) 90 123 4567" },
      email: { type: String, default: "" },
      address: { type: String, default: "" },
      workingHours: { type: String, default: "" },
      mapEmbedUrl: { type: String, default: "" },
    },

    social: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      zalo: { type: String, default: "" },
    },

    seo: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
      ogImage: { type: String, default: "" },
      siteUrl: { type: String, default: "" }, // domain thật của site, vd: https://ten-mien.vercel.app — dùng cho Schema.org & canonical URL
      priceRange: { type: String, default: "$$" }, // dùng cho Local Business Schema, vd: "$", "$$", "$$$"
    },

    footerText: { type: String, default: "© 2026 Website của bạn. Mọi quyền được bảo lưu." },
    footerContactHeading: { type: String, default: "Liên hệ" },

    shipping: {
      freeShippingThreshold: { type: Number, default: 2000000 },
      flatShippingFee: { type: Number, default: 50000 },
      vatPercent: { type: Number, default: 10 },
    },

    // danh sách xuất xứ để chọn khi tạo sản phẩm, quản lý ở trang Giao diện & Cài đặt
    productOrigins: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Setting", settingSchema);
