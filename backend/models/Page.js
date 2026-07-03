const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  type: { type: String, required: true }, // hero, intro, product-grid, project-grid, cta, team, ...
  order: { type: Number, default: 0 },
  content: { type: mongoose.Schema.Types.Mixed, default: {} }, // linh hoạt chứa heading, text, image, buttons, v.v.
  style: { type: mongoose.Schema.Types.Mixed, default: {} }, // backgroundColor, textColor, fontSize, padding...
});

const pageSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true }, // home, about, products, ...
  title: { type: String, required: true },
  sections: [sectionSchema],
}, { timestamps: true });

module.exports = mongoose.model('Page', pageSchema);