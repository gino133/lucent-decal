const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Setting = require("../models/Setting");
const Menu = require("../models/Menu");
const Page = require("../models/Page");
const Category = require("../models/Category");
const Product = require("../models/Product");
const Project = require("../models/Project");
const Post = require("../models/Post");

const IMG = (seed) => `https://picsum.photos/seed/${seed}/1200/800`;

// Chạy được cả từ CLI (npm run seed) lẫn từ API (/api/seed).
// force=false (mặc định): chỉ tạo tài khoản admin nếu chưa có, không đụng gì tới nội dung cũ.
// force=true: xoá sạch và tạo lại toàn bộ dữ liệu mẫu.
async function runSeed({ force = false, resetPassword = false } = {}) {
  const log = [];

  const adminEmail = (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase();
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || "Admin@123456", 10);
    await User.create({ name: "Quản trị viên", email: adminEmail, password: hashed, role: "admin" });
    log.push(`Đã tạo tài khoản admin: ${adminEmail}`);
  } else if (resetPassword) {
    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || "Admin@123456", 10);
    existingAdmin.password = hashed;
    await existingAdmin.save();
    log.push(`Đã đặt lại mật khẩu cho tài khoản admin: ${adminEmail}`);
  } else {
    log.push(`Tài khoản admin đã tồn tại: ${adminEmail} (bỏ qua)`);
  }

  const hasContent = (await Page.countDocuments()) > 0;
  if (hasContent && !force) {
    log.push("Đã có dữ liệu nội dung rồi nên bỏ qua, không ghi đè. Muốn tạo lại từ đầu thì gọi với force=true.");
    return log;
  }

  await Setting.deleteMany({});
  await Setting.create({
    siteName: "Website của bạn",
    tagline: "Mô tả ngắn gọn về doanh nghiệp của bạn",
    colors: {
      primary: "#5f5f59",
      secondary: "#fae519",
      background: "#fbf9f9",
      onBackground: "#1b1c1c",
      surface: "#efeded",
      outline: "#777770",
    },
    fonts: { heading: "Montserrat", body: "Inter" },
    contact: {
      phone: "",
      email: "",
      address: "",
      workingHours: "",
    },
    social: {},
    footerText: "© 2026 Website của bạn. Mọi quyền được bảo lưu.",
  });

  await Menu.deleteMany({});
  await Menu.create({
    key: "main",
    items: [
      { label: "Trang chủ", url: "/", order: 0 },
      { label: "Giới thiệu", url: "/gioi-thieu", order: 1 },
      { label: "Sản phẩm", url: "/san-pham", order: 2 },
      { label: "Dự án", url: "/du-an", order: 3 },
      { label: "Tin tức", url: "/tin-tuc", order: 4 },
      { label: "Hồ sơ năng lực", url: "/ho-so-nang-luc", order: 5 },
      { label: "Liên hệ", url: "/lien-he", order: 6 },
    ],
  });
  await Menu.create({
    key: "footer",
    items: [
      {
        label: "Khám phá",
        url: "#",
        order: 0,
        children: [
          { label: "Sản phẩm", url: "/san-pham" },
          { label: "Dự án", url: "/du-an" },
          { label: "Tin tức", url: "/tin-tuc" },
        ],
      },
      {
        label: "Công ty",
        url: "#",
        order: 1,
        children: [
          { label: "Về chúng tôi", url: "/gioi-thieu" },
          { label: "Dự án tiêu biểu", url: "/du-an" },
          { label: "Chính sách bảo mật", url: "/trang/chinh-sach-bao-mat" },
          { label: "Điều khoản sử dụng", url: "/trang/dieu-khoan" },
        ],
      },
    ],
  });

  await Category.deleteMany({});
  const catA = await Category.create({ name: "Danh mục A", slug: "danh-muc-a", type: "product" });
  const catB = await Category.create({ name: "Danh mục B", slug: "danh-muc-b", type: "product" });
  const catProjectA = await Category.create({ name: "Loại dự án A", slug: "loai-du-an-a", type: "project" });
  const catProjectB = await Category.create({ name: "Loại dự án B", slug: "loai-du-an-b", type: "project" });
  const catPost = await Category.create({ name: "Chuyên mục", slug: "chuyen-muc", type: "post" });
  const catAnnounce = await Category.create({ name: "Thông báo", slug: "thong-bao", type: "post" });

  await Product.deleteMany({});
  const products = [
    { name: "Sản phẩm mẫu 1", category: catA._id, price: 500000, isNew: true, isFeatured: true },
    { name: "Sản phẩm mẫu 2", category: catA._id, price: 350000, isFeatured: true },
    { name: "Sản phẩm mẫu 3", category: catB._id, price: 1200000, isFeatured: true },
    { name: "Sản phẩm mẫu 4", category: catB._id, price: 800000 },
  ];
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    await Product.create({
      ...p,
      unit: "sản phẩm",
      slug: `san-pham-mau-${i + 1}`,
      shortDescription: "Mô tả ngắn cho sản phẩm này — sửa lại trong trang Quản trị.",
      description: "<p>Mô tả chi tiết sản phẩm. Vào Quản trị &gt; Sản phẩm để chỉnh sửa nội dung này.</p>",
      images: [IMG("product" + i)],
      order: i,
    });
  }

  await Project.deleteMany({});
  const projects = [
    { name: "Dự án mẫu 1", category: catProjectA._id, client: "Khách hàng A", location: "", year: "2025", isFeatured: true },
    { name: "Dự án mẫu 2", category: catProjectB._id, client: "Khách hàng B", location: "", year: "2025" },
  ];
  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    await Project.create({
      ...p,
      slug: `du-an-mau-${i + 1}`,
      coverImage: IMG("project" + i),
      images: [IMG("project" + i + "b")],
      shortDescription: "Mô tả ngắn cho dự án này — sửa lại trong trang Quản trị.",
      description: "<p>Mô tả chi tiết dự án. Vào Quản trị &gt; Dự án để chỉnh sửa nội dung này.</p>",
      order: i,
    });
  }

  await Page.deleteMany({});
  await Page.create({
    slug: "home",
    title: "Trang chủ",
    blocks: [
      { type: "hero", order: 0, data: {
        title: "Tiêu đề chính của trang chủ",
        subtitle: "Câu mô tả ngắn giới thiệu về doanh nghiệp của bạn — chỉnh sửa ở Quản trị > Nội dung trang.",
        image: IMG("hero"), ctaText: "Liên hệ ngay", ctaLink: "/lien-he",
      }},
      { type: "productsFeatured", order: 1, data: { title: "Sản phẩm nổi bật" } },
      { type: "projectsFeatured", order: 2, data: { title: "Dự án tiêu biểu" } },
      { type: "postsFeatured", order: 3, data: { title: "Tin tức mới nhất" } },
      { type: "cta", order: 4, data: {
        title: "Sẵn sàng hợp tác cùng chúng tôi?",
        description: "Liên hệ ngay để được tư vấn chi tiết.",
        ctaText: "Liên hệ ngay", ctaLink: "/lien-he",
      }},
    ],
  });

  await Page.create({
    slug: "gioi-thieu",
    title: "Giới thiệu",
    blocks: [
      { type: "hero", order: 0, data: { title: "Về chúng tôi", subtitle: "Giới thiệu ngắn gọn về công ty.", image: IMG("about") } },
      { type: "richtext", order: 1, data: { html: "<p>Nội dung giới thiệu chi tiết về công ty, lịch sử hình thành, thế mạnh... Chỉnh sửa ở Quản trị &gt; Nội dung trang.</p>" } },
      { type: "stats", order: 2, data: { items: [
        { number: "0", label: "Số liệu 1" },
        { number: "0", label: "Số liệu 2" },
        { number: "0", label: "Số liệu 3" },
        { number: "0", label: "Số liệu 4" },
      ]}},
    ],
  });

  await Page.create({
    slug: "ho-so-nang-luc",
    title: "Hồ sơ năng lực",
    blocks: [
      { type: "hero", order: 0, data: { title: "Hồ sơ năng lực", subtitle: "Năng lực và thế mạnh của công ty.", image: IMG("profile") } },
      { type: "richtext", order: 1, data: { html: "<p>Nội dung về năng lực, đội ngũ, trang thiết bị... Chỉnh sửa ở Quản trị &gt; Nội dung trang.</p>" } },
      { type: "logos", order: 2, data: { title: "Đối tác tiêu biểu", logos: [] } },
    ],
  });

  await Page.create({
    slug: "lien-he",
    title: "Liên hệ",
    blocks: [
      { type: "hero", order: 0, data: { title: "Liên hệ với chúng tôi", subtitle: "Chúng tôi luôn sẵn sàng lắng nghe và tư vấn." } },
      { type: "contactForm", order: 1, data: {} },
      { type: "map", order: 2, data: {} },
    ],
  });

  await Page.create({
    slug: "chinh-sach-bao-mat",
    title: "Chính sách bảo mật",
    blocks: [{ type: "richtext", order: 0, data: { html: "<p>Nội dung chính sách bảo mật — chỉnh sửa ở Quản trị &gt; Nội dung trang.</p>" } }],
  });

  await Page.create({
    slug: "dieu-khoan",
    title: "Điều khoản dịch vụ",
    blocks: [{ type: "richtext", order: 0, data: { html: "<p>Nội dung điều khoản dịch vụ — chỉnh sửa ở Quản trị &gt; Nội dung trang.</p>" } }],
  });

  await Post.deleteMany({});
  const posts = [
    {
      title: "Bài viết mẫu 1",
      category: catPost._id,
      excerpt: "Mô tả ngắn cho bài viết này — sửa lại trong trang Quản trị.",
      content: "<p>Nội dung bài viết mẫu. Vào Quản trị &gt; Tin tức để chỉnh sửa hoặc xoá bài này.</p>",
      isFeatured: true,
    },
    {
      title: "Thông báo mẫu",
      category: catAnnounce._id,
      excerpt: "Mô tả ngắn cho thông báo này — sửa lại trong trang Quản trị.",
      content: "<p>Nội dung thông báo mẫu. Vào Quản trị &gt; Tin tức để chỉnh sửa hoặc xoá bài này.</p>",
    },
  ];
  for (let i = 0; i < posts.length; i++) {
    const p = posts[i];
    await Post.create({
      ...p,
      slug: `bai-viet-mau-${i + 1}`,
      coverImage: IMG("post" + i),
      publishedAt: new Date(Date.now() - i * 86400000),
    });
  }

  log.push("Đã tạo dữ liệu mẫu: cài đặt, menu, danh mục, sản phẩm, dự án, bài viết, các trang nội dung.");
  return log;
}

module.exports = { runSeed };
