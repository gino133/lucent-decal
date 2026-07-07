const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    url: { type: String, required: true }, // ví dụ /san-pham hoặc /trang/gioi-thieu
    order: { type: Number, default: 0 },
    openInNewTab: { type: Boolean, default: false },
    children: [
      {
        label: String,
        url: String,
        order: { type: Number, default: 0 },
      },
    ],
  },
  { _id: true }
);

const menuSchema = new mongoose.Schema(
  {
    key: { type: String, default: "main", unique: true }, // main | footer
    items: [menuItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Menu", menuSchema);
