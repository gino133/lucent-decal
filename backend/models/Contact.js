const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: String,
    email: String,
    subject: String,
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "replied", "archived"], default: "new" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
