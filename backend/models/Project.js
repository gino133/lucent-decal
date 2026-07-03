const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, enum: ['Văn phòng', 'Nhà ở', 'Thương mại'], required: true },
  location: { type: String },
  year: { type: Number },
  description: { type: String },
  coverImage: { type: String, required: true },
  images: [String],
  challenge: { type: String },
  solution: { type: String },
  stats: { type: mongoose.Schema.Types.Mixed, default: {} }, // số liệu
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);