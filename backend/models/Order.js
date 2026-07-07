const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    image: String,
    variant: String, // ví dụ "Mẫu: Geometric L1 | 1.2m x 2m"
    price: Number,
    quantity: Number,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderCode: { type: String, required: true, unique: true }, // LG20260706-xxxx
    customer: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      email: String,
      address: { type: String, required: true },
      note: String,
    },
    items: [orderItemSchema],
    subtotal: Number,
    shippingFee: Number,
    vatAmount: Number,
    total: Number,
    paymentMethod: { type: String, enum: ["vnpay", "cod"], default: "vnpay" },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "cancelled"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["new", "confirmed", "processing", "shipping", "completed", "cancelled"],
      default: "new",
    },
    vnpayTxnRef: String,
    vnpayTransactionNo: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
