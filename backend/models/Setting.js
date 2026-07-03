const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true }, // có thể là object
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);