require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Chặn lỗi làm sập cả server: bình thường nếu 1 route quên try/catch mà lỗi,
// Node sẽ tự tắt luôn tiến trình (ảnh hưởng tới mọi người dùng, không riêng ai).
// 2 listener này giữ cho server chỉ log lỗi rồi chạy tiếp, không bị sập nữa.
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

app.get("/", (req, res) => res.json({ message: "API đang chạy 🚀" }));
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
app.use("/api/media", require("./routes/media"));
app.use("/api/seed", require("./routes/seed"));

// 404
app.use((req, res) => res.status(404).json({ message: "Không tìm thấy endpoint" }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);

  // Lỗi dữ liệu sai schema MongoDB (vd "type" không nằm trong danh sách cho phép)
  // thì trả 400 dễ hiểu, thay vì rơi vào lỗi 500 chung chung.
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
