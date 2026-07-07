require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");
const Setting = require("./models/Setting");
const Menu = require("./models/Menu");
const Page = require("./models/Page");
const Category = require("./models/Category");
const Product = require("./models/Product");
const Project = require("./models/Project");

const IMG = (seed) => `https://picsum.photos/seed/${seed}/1200/800`;

async function run() {
  await connectDB();

  // 1. Admin user
  const adminEmail = process.env.ADMIN_EMAIL || "admin@lucentglass.vn";
  const exists = await User.findOne({ email: adminEmail });
  if (!exists) {
    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || "Admin@123456", 10);
    await User.create({ name: "Quản trị viên", email: adminEmail, password: hashed, role: "admin" });
    console.log("✅ Đã tạo tài khoản admin:", adminEmail);
  }

  // 2. Settings
  await Setting.deleteMany({});
  await Setting.create({
    siteName: "Lucent Glass",
    tagline: "Kiến tạo không gian kiến trúc",
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
      phone: "+84 (0) 90 123 4567",
      email: "hello@lucentglass.vn",
      address: "123 Đường Kiến Trúc, Quận 1, TP. Hồ Chí Minh",
      workingHours: "Thứ 2 - Thứ 7: 8:00 - 18:00",
    },
    social: { facebook: "#", instagram: "#", linkedin: "#" },
    footerText: "© 2026 Lucent Glass & Decals. Sự chính xác trong từng tấm kính.",
  });

  // 3. Menu
  await Menu.deleteMany({});
  await Menu.create({
    key: "main",
    items: [
      { label: "Trang chủ", url: "/", order: 0 },
      { label: "Giới thiệu", url: "/gioi-thieu", order: 1 },
      { label: "Sản phẩm", url: "/san-pham", order: 2 },
      { label: "Dự án", url: "/du-an", order: 3 },
      { label: "Hồ sơ năng lực", url: "/ho-so-nang-luc", order: 4 },
      { label: "Liên hệ", url: "/lien-he", order: 5 },
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
          { label: "Decal Văn Phòng", url: "/san-pham?category=decal-van-phong" },
          { label: "Kính Nghệ Thuật", url: "/san-pham?category=kinh-nghe-thuat" },
          { label: "Thi Công Trọn Gói", url: "/san-pham" },
          { label: "Dự án tùy chỉnh", url: "/du-an" },
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

  // 4. Categories
  await Category.deleteMany({});
  const catDecal = await Category.create({ name: "Decal Văn Phòng", slug: "decal-van-phong", type: "product" });
  const catKinh = await Category.create({ name: "Kính Nghệ Thuật", slug: "kinh-nghe-thuat", type: "product" });
  const catCachNhiet = await Category.create({ name: "Phim Cách Nhiệt", slug: "phim-cach-nhiet", type: "product" });

  const catVanPhong = await Category.create({ name: "Văn phòng", slug: "van-phong", type: "project" });
  const catThuongMai = await Category.create({ name: "Thương mại", slug: "thuong-mai", type: "project" });

  // 5. Products
  await Product.deleteMany({});
  const products = [
    { name: "Decal Hoa Văn Geometric", category: catDecal._id, price: 600000, unit: "cuộn (1.2m x 5m)", isNew: true, isFeatured: true },
    { name: "Decal Mờ Phun Cát", category: catDecal._id, price: 205000, unit: "m²", isFeatured: true },
    { name: "Kính Cường Lực Nghệ Thuật", category: catKinh._id, price: 1200000, unit: "m²", isFeatured: true },
    { name: "Phim Cách Nhiệt Cao Cấp", category: catCachNhiet._id, price: 850000, unit: "m²" },
    { name: "Decal Văn Phòng Riêng Tư", category: catDecal._id, price: 320000, unit: "m²" },
    { name: "Kính Thông Minh Đổi Màu", category: catKinh._id, price: 2500000, unit: "m²" },
  ];
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    await Product.create({
      ...p,
      slug: p.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-"),
      shortDescription: "Giải pháp decal/kính kiến trúc cao cấp, thi công chuyên nghiệp, bảo hành dài hạn.",
      description: "<p>Sản phẩm chất lượng cao, được tuyển chọn từ các nhà cung cấp uy tín, phù hợp cho không gian văn phòng, nhà ở và thương mại hiện đại.</p>",
      images: [IMG("p" + i + "a"), IMG("p" + i + "b")],
      specs: [
        { label: "Chất liệu", value: "PVC cao cấp" },
        { label: "Bảo hành", value: "24 tháng" },
      ],
      order: i,
    });
  }

  // 6. Projects
  await Project.deleteMany({});
  const projects = [
    { name: "Alpha Tech HQ", category: catVanPhong._id, client: "Alpha Tech", location: "TP.HCM", year: "2025", isFeatured: true },
    { name: "Trung tâm Tài chính Toàn cầu", category: catThuongMai._id, client: "GFC", location: "Hà Nội", year: "2025" },
    { name: "Showroom Lumina", category: catThuongMai._id, client: "Lumina", location: "Đà Nẵng", year: "2024" },
  ];
  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    await Project.create({
      ...p,
      slug: p.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-"),
      coverImage: IMG("proj" + i),
      images: [IMG("proj" + i + "1"), IMG("proj" + i + "2"), IMG("proj" + i + "3")],
      shortDescription: "Decal kính họa tiết hình học tùy chỉnh cho không gian kiến trúc hiện đại.",
      description: "<p>Dự án được thực hiện với quy trình khảo sát, thiết kế và thi công chuyên nghiệp, mang lại không gian kiến trúc ấn tượng.</p>",
      order: i,
    });
  }

  // 7. Pages (block builder) - Trang chủ, Giới thiệu, Hồ sơ năng lực, Liên hệ
  await Page.deleteMany({});
  await Page.create({
    slug: "home",
    title: "Trang chủ",
    blocks: [
      {
        type: "hero",
        order: 0,
        data: {
          title: "Kiến tạo không gian\nbằng nghệ thuật kính",
          subtitle: "Giải pháp decal kính & kiến trúc kính cao cấp cho không gian văn phòng, thương mại và nhà ở.",
          image: IMG("hero"),
          ctaText: "Nhận tư vấn ngay",
          ctaLink: "/lien-he",
        },
      },
      { type: "productsFeatured", order: 1, data: { title: "Sản phẩm nổi bật" } },
      { type: "projectsFeatured", order: 2, data: { title: "Dự án tiêu biểu" } },
      {
        type: "cta",
        order: 3,
        data: {
          title: "Bạn đã sẵn sàng để thay đổi không gian?",
          description: "Liên hệ ngay để nhận khảo sát miễn phí và báo giá chi tiết cho giải pháp decal kính nghệ thuật chuyên nghiệp nhất.",
          ctaText: "Nhận tư vấn ngay",
          ctaLink: "/lien-he",
        },
      },
    ],
  });

  await Page.create({
    slug: "gioi-thieu",
    title: "Giới thiệu",
    blocks: [
      {
        type: "hero",
        order: 0,
        data: { title: "Về Lucent Glass", subtitle: "Định hình tương lai không gian kiến trúc qua nghệ thuật kính.", image: IMG("about") },
      },
      {
        type: "richtext",
        order: 1,
        data: { html: "<p>Lucent Glass là đơn vị tiên phong trong lĩnh vực decal kính và giải pháp kiến trúc kính tại Việt Nam, với hơn 10 năm kinh nghiệm phục vụ hàng trăm dự án văn phòng, thương mại và nhà ở.</p>" },
      },
      {
        type: "stats",
        order: 2,
        data: {
          items: [
            { number: "500+", label: "Dự án hoàn thành" },
            { number: "10+", label: "Năm kinh nghiệm" },
            { number: "50+", label: "Đối tác chiến lược" },
            { number: "100%", label: "Khách hàng hài lòng" },
          ],
        },
      },
    ],
  });

  await Page.create({
    slug: "ho-so-nang-luc",
    title: "Hồ sơ năng lực",
    blocks: [
      { type: "hero", order: 0, data: { title: "Hồ sơ năng lực", subtitle: "Năng lực thi công & thế mạnh của Lucent Glass", image: IMG("profile") } },
      { type: "richtext", order: 1, data: { html: "<p>Với đội ngũ kỹ thuật viên giàu kinh nghiệm và hệ thống máy móc hiện đại, chúng tôi tự tin đáp ứng mọi yêu cầu về decal kính và kiến trúc kính quy mô lớn.</p>" } },
      { type: "logos", order: 2, data: { title: "Đối tác tiêu biểu", logos: [] } },
    ],
  });

  await Page.create({
    slug: "lien-he",
    title: "Liên hệ",
    blocks: [
      { type: "hero", order: 0, data: { title: "Liên hệ với chúng tôi", subtitle: "Chúng tôi luôn sẵn sàng lắng nghe và tư vấn giải pháp phù hợp nhất." } },
      { type: "contactForm", order: 1, data: {} },
      { type: "map", order: 2, data: {} },
    ],
  });

  console.log("🌱 Seed dữ liệu hoàn tất!");
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
