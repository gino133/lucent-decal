require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

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
app.use("/api/orders", require("./routes/orders"));
app.use("/api/contacts", require("./routes/contacts"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/seed", require("./routes/seed"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/comments", require("./routes/comments"));

// 404
app.use((req, res) => res.status(404).json({ message: "Không tìm thấy endpoint" }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Lỗi máy chủ" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server chạy tại cổng ${PORT}`));
