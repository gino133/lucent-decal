const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  price: { type: Number, required: true }, // giá theo m²
  category: { type: String, enum: ['frosted', 'pattern', 'gradient', 'tint'], default: 'frosted' },
  images: [String],
  inStock: { type: Boolean, default: true },
  badge: { type: String, enum: ['Mới', 'Bán chạy', 'Giảm giá'], default: null },
  specifications: { type: mongoose.Schema.Types.Mixed, default: {} }, // thông số kỹ thuật
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);