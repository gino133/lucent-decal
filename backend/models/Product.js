const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" }, // HTML rich text
    price: { type: Number, required: true },
    unit: { type: String, default: "m²" }, // m², cuộn, m...
    images: [{ type: String }],
    specs: [{ label: String, value: String }],
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
