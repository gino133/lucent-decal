require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// LỚP BẢO VỆ TOÀN HỆ THỐNG — quan trọng nhất trong file này.
// Mặc định, nếu 1 route "async (req,res) => {...}" ném lỗi mà không có try/catch,
// Node.js coi đó là "unhandledRejection" và (từ Node 15+) sẽ TỰ TẮT LUÔN CẢ TIẾN
// TRÌNH SERVER — nghĩa là 1 request lỗi có thể làm sập toàn bộ website cho MỌI người
// dùng, không chỉ riêng người vừa thao tác. Đây chính là nguyên nhân gây lỗi 502/503
// trước đó (lưu 1 khối nội dung có "type" không hợp lệ theo schema MongoDB).
// Hai listener dưới đây đảm bảo: dù có lỗi tương tự xảy ra ở bất kỳ đâu trong tương lai
// (kể cả những chỗ chưa kịp bọc try/catch), server CHỈ log lỗi ra và tiếp tục chạy,
// không bao giờ sập toàn bộ vì 1 request lỗi nữa.
process.on("unhandledRejection", (reason) => {
  console.error("⚠️ Unhandled Promise Rejection (đã chặn, server vẫn tiếp tục chạy):", reason);
});
process.on("uncaughtException", (err) => {
  console.error("⚠️ Uncaught Exception (đã chặn, server vẫn tiếp tục chạy):", err);
});

const app = express();
connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_URL?.split(",") || "*",
    credentials: true,
  })
);
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.json({ message: "Lucent Glass API đang chạy 🚀" }));
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/settings", require("./routes/settings"));
app.use("/api/menu", require("./routes/menu"));
app.use("/api/pages", require("./routes/pages"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/products", require("./routes/products"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/comments", require("./routes/comments"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/contacts", require("./routes/contacts"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/seed", require("./routes/seed"));

// 404
app.use((req, res) => res.status(404).json({ message: "Không tìm thấy endpoint" }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);

  // Lỗi dữ liệu không hợp lệ theo schema MongoDB (VD: "type" của 1 khối nội dung
  // không nằm trong danh sách cho phép) — trả về 400 kèm thông tin rõ ràng,
  // thay vì để rơi vào lỗi 500 chung chung khó chẩn đoán.
  if (err.name === "ValidationError") {
    const details = Object.values(err.errors || {}).map((e) => e.message);
    return res.status(400).json({ message: "Dữ liệu không hợp lệ: " + details.join("; ") });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ message: `Giá trị không hợp lệ cho trường "${err.path}"` });
  }

  res.status(err.status || 500).json({ message: err.message || "Lỗi máy chủ" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server chạy tại cổng ${PORT}`));
