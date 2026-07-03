const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  label: { type: String, required: true },
  link: { type: String, required: true },
  order: { type: Number, default: 0 },
});

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // 'main-menu', 'footer-menu'
  items: [menuItemSchema],
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);