const express = require("express");
const cloudinary = require("../config/cloudinary");
const Media = require("../models/Media");
const Product = require("../models/Product");
const Post = require("../models/Post");
const Project = require("../models/Project");
const Page = require("../models/Page");
const Setting = require("../models/Setting");
const { protect } = require("../middleware/auth");
const asyncHandler = require("../middleware/asyncHandler");
const router = express.Router();

// GET /api/media?page=&limit=&search= (admin — danh sách ảnh đã tải lên để chọn dùng lại)
router.get("/", protect, asyncHandler(async (req, res) => {
  const { page = 1, limit = 40, search = "" } = req.query;
  const filter = search ? { filename: { $regex: search, $options: "i" } } : {};
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Media.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Media.countDocuments(filter),
  ]);
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / limit) });
}));

// GET /api/media/:id/usage (admin — trước khi xoá, kiểm tra ảnh này đang được dùng ở
// đâu: sản phẩm, bài viết, dự án, trang tự tạo, hay cài đặt chung — để tránh xoá nhầm
// làm vỡ ảnh ở chỗ khác. Quét theo URL ảnh (không phải theo _id media) vì nội dung ở
// các chỗ khác chỉ lưu URL, không lưu tham chiếu tới Media)
router.get("/:id/usage", protect, asyncHandler(async (req, res) => {
  const media = await Media.findById(req.params.id);
  if (!media) return res.status(404).json({ message: "Không tìm thấy ảnh" });
  const url = media.url;

  const [products, posts, projects, pages, settings] = await Promise.all([
    Product.find({}, "name slug images description variants").lean(),
    Post.find({}, "title slug coverImage content").lean(),
    Project.find({}, "name slug coverImage images description materials beforeAfterImages").lean(),
    Page.find({}, "title slug blocks").lean(),
    Setting.findOne({}, "logoUrl faviconUrl seo"),
  ]);

  const usages = [];

  for (const p of products) {
    const hit =
      (p.images || []).includes(url) ||
      (p.description || "").includes(url) ||
      (p.variants || []).some((v) => v.image === url);
    if (hit) usages.push({ type: "product", label: "Sản phẩm", name: p.name, publicUrl: `/san-pham/${p.slug}`, adminUrl: `/admin/san-pham/${p._id}/edit` });
  }

  for (const post of posts) {
    const hit = post.coverImage === url || (post.content || "").includes(url);
    if (hit) usages.push({ type: "post", label: "Bài viết", name: post.title, publicUrl: `/tin-tuc/${post.slug}`, adminUrl: `/admin/tin-tuc/${post._id}/edit` });
  }

  for (const pr of projects) {
    const imagesHit = (pr.images || []).some((img) => (typeof img === "string" ? img === url : img?.url === url));
    const materialsHit = (pr.materials || []).some((m) => m.image === url);
    const baHit = (pr.beforeAfterImages || []).some((b) => b.before === url || b.after === url);
    const hit = pr.coverImage === url || imagesHit || materialsHit || baHit || (pr.description || "").includes(url);
    if (hit) usages.push({ type: "project", label: "Dự án", name: pr.name, publicUrl: `/du-an/${pr.slug}`, adminUrl: `/admin/du-an/${pr._id}/edit` });
  }

  for (const page of pages) {
    // block.data không có cấu trúc cố định (tuỳ loại block), nên kiểm tra bằng cách
    // chuyển cả blocks thành chuỗi rồi tìm URL trong đó — chắc chắn bắt được mọi trường hợp
    const hit = JSON.stringify(page.blocks || []).includes(url);
    if (hit) usages.push({ type: "page", label: "Trang", name: page.title, publicUrl: `/${page.slug}`, adminUrl: `/admin/trang?slug=${page.slug}` });
  }

  if (settings) {
    if (settings.logoUrl === url) usages.push({ type: "settings", label: "Cài đặt", name: "Logo website", adminUrl: "/admin/giao-dien" });
    if (settings.faviconUrl === url) usages.push({ type: "settings", label: "Cài đặt", name: "Favicon", adminUrl: "/admin/giao-dien" });
    if (settings.seo?.ogImage === url) usages.push({ type: "settings", label: "Cài đặt", name: "Ảnh SEO mặc định (OG image)", adminUrl: "/admin/giao-dien" });
  }

  res.json({ url, usages });
}));

// DELETE /api/media/:id (admin — xoá khỏi thư viện, xoá luôn trên Cloudinary)
router.delete("/:id", protect, asyncHandler(async (req, res) => {
  const media = await Media.findById(req.params.id);
  if (!media) return res.status(404).json({ message: "Không tìm thấy ảnh" });
  try {
    await cloudinary.uploader.destroy(media.publicId);
  } catch (e) {
    console.error("Xoá ảnh trên Cloudinary thất bại (bỏ qua, vẫn xoá khỏi thư viện):", e.message);
  }
  await media.deleteOne();
  res.json({ message: "Đã xoá" });
}));

module.exports = router;
