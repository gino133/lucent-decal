const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" }, // HTML rich text
    price: { type: Number, required: true }, // Giá cơ bản / "giá từ" khi sản phẩm có biến thể
    unit: { type: String, default: "m²" }, // m², cuộn, m... (dùng khi KHÔNG có biến thể)
    images: [{ type: String }],
    specs: [{ label: String, value: String }],

    // Các loại tuỳ chọn do admin định nghĩa, vd: { name: "Màu sắc", values: ["Trắng","Đen"] }
    optionTypes: [
      {
        name: { type: String, required: true },
        values: [{ type: String }],
      },
    ],

    // Mỗi biến thể là 1 tổ hợp giá trị tuỳ chọn (theo đúng thứ tự optionTypes), kèm giá riêng
    variants: [
      {
        optionValues: [{ type: String }], // vd: ["Trắng", "1.2m x 2m", "m²"]
        price: { type: Number, required: true },
        stock: { type: Number, default: 999 },
        sku: { type: String, default: "" },
      },
    ],

    isNew: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    stock: { type: Number, default: 999 },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", shortDescription: "text" });

module.exports = mongoose.model("Product", productSchema);
