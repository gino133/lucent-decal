const express = require("express");
const moment = require("moment");
const Order = require("../models/Order");
const Setting = require("../models/Setting");
const { protect } = require("../middleware/auth");
const { createPaymentUrl, verifyReturnUrl } = require("../utils/vnpay");
const router = express.Router();

function genOrderCode() {
  return "LG" + moment().format("YYYYMMDD-HHmmss") + Math.floor(Math.random() * 90 + 10);
}

// POST /api/orders  -> tạo đơn hàng, trả về paymentUrl nếu chọn vnpay
router.post("/", async (req, res) => {
  try {
    const { customer, items, paymentMethod = "vnpay" } = req.body;
    if (!items || !items.length) return res.status(400).json({ message: "Giỏ hàng trống" });

    const setting = (await Setting.findOne()) || {};
    const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const shippingFee =
      subtotal >= (setting.shipping?.freeShippingThreshold || 2000000)
        ? 0
        : setting.shipping?.flatShippingFee || 50000;
    const vatAmount = Math.round((subtotal * (setting.shipping?.vatPercent || 10)) / 100);
    const total = subtotal + shippingFee + vatAmount;

    const order = await Order.create({
      orderCode: genOrderCode(),
      customer,
      items,
      subtotal,
      shippingFee,
      vatAmount,
      total,
      paymentMethod,
    });

    if (paymentMethod === "vnpay") {
      const ipAddr =
        req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress || "127.0.0.1";
      const paymentUrl = createPaymentUrl({
        orderCode: order.orderCode,
        amount: total,
        orderInfo: `Thanh toan don hang ${order.orderCode}`,
        ipAddr,
      });
      order.vnpayTxnRef = order.orderCode;
      await order.save();
      return res.status(201).json({ order, paymentUrl });
    }

    res.status(201).json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/vnpay-return  -> FE gọi API này sau khi VNPay redirect về, kèm toàn bộ query string
router.get("/vnpay-return", async (req, res) => {
  const isValid = verifyReturnUrl(req.query);
  if (!isValid) return res.status(400).json({ success: false, message: "Chữ ký không hợp lệ" });

  const { vnp_TxnRef, vnp_ResponseCode, vnp_TransactionNo } = req.query;
  const order = await Order.findOne({ orderCode: vnp_TxnRef });
  if (!order) return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });

  if (vnp_ResponseCode === "00") {
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.vnpayTransactionNo = vnp_TransactionNo;
    await order.save();
    return res.json({ success: true, order });
  } else {
    order.paymentStatus = "failed";
    await order.save();
    return res.json({ success: false, order, message: "Thanh toán không thành công" });
  }
});

// VNPay IPN (server-to-server, dùng khi lên production)
router.get("/vnpay-ipn", async (req, res) => {
  const isValid = verifyReturnUrl(req.query);
  if (!isValid) return res.json({ RspCode: "97", Message: "Invalid signature" });

  const { vnp_TxnRef, vnp_ResponseCode, vnp_TransactionNo } = req.query;
  const order = await Order.findOne({ orderCode: vnp_TxnRef });
  if (!order) return res.json({ RspCode: "01", Message: "Order not found" });

  if (vnp_ResponseCode === "00") {
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.vnpayTransactionNo = vnp_TransactionNo;
  } else {
    order.paymentStatus = "failed";
  }
  await order.save();
  res.json({ RspCode: "00", Message: "Confirm Success" });
});

// GET /api/orders/track/:orderCode (public - khách tra cứu đơn hàng)
router.get("/track/:orderCode", async (req, res) => {
  const order = await Order.findOne({ orderCode: req.params.orderCode });
  if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
  res.json(order);
});

// ---- Admin ----
router.get("/", protect, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

router.put("/:id", protect, async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(order);
});

module.exports = router;
