const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: "Lucent Glass" },
    tagline: { type: String, default: "Kiến tạo không gian kiến trúc" },
    logoUrl: { type: String, default: "" },
    faviconUrl: { type: String, default: "" },

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
      email: { type: String, default: "hello@lucentglass.vn" },
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
      siteUrl: { type: String, default: "" }, // vd: https://lucent-decal.vercel.app — dùng cho Schema.org & canonical URL
      priceRange: { type: String, default: "$$" }, // dùng cho Local Business Schema, vd: "$", "$$", "$$$"
    },

    footerText: { type: String, default: "© 2026 Lucent Glass. Kiến Trúc Hoàn Hảo." },

    shipping: {
      freeShippingThreshold: { type: Number, default: 2000000 },
      flatShippingFee: { type: Number, default: 50000 },
      vatPercent: { type: Number, default: 10 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Setting", settingSchema);
