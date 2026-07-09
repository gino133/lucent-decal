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

// Hàm seed dùng chung cho cả CLI (`npm run seed`) và API (/api/seed)
// force=false (mặc định): chỉ tạo tài khoản admin nếu chưa có, KHÔNG đụng vào dữ liệu nội dung đã có sẵn
// force=true: xoá và tạo lại toàn bộ dữ liệu mẫu (menu, trang, danh mục, sản phẩm, dự án)
async function runSeed({ force = false, resetPassword = false } = {}) {
  const log = [];

  // 1. Admin user — luôn kiểm tra, không bao giờ xoá user cũ
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@lucentglass.vn").toLowerCase();
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || "Admin@123456", 10);
    await User.create({ name: "Quản trị viên", email: adminEmail, password: hashed, role: "admin" });
    log.push(`Đã tạo tài khoản admin: ${adminEmail}`);
  } else if (resetPassword) {
    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || "Admin@123456", 10);
    existingAdmin.password = hashed;
    await existingAdmin.save();
    log.push(`Đã đặt lại mật khẩu cho tài khoản admin: ${adminEmail} (theo giá trị ADMIN_PASSWORD hiện tại)`);
  } else {
    log.push(`Tài khoản admin đã tồn tại: ${adminEmail} (bỏ qua)`);
  }

  const hasContent = (await Page.countDocuments()) > 0;
  if (hasContent && !force) {
    log.push("Đã có dữ liệu nội dung (menu/trang/sản phẩm...) — bỏ qua để không ghi đè. Dùng force=true nếu muốn tạo lại từ đầu.");
    return log;
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
  const catTinTuc = await Category.create({ name: "Kiến thức", slug: "kien-thuc", type: "post" });
  const catThongBao = await Category.create({ name: "Thông báo", slug: "thong-bao", type: "post" });

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

  // 7. Pages (block builder)
  await Page.deleteMany({});
  await Page.create({
    slug: "home",
    title: "Trang chủ",
    blocks: [
      { type: "hero", order: 0, data: {
        title: "Kiến tạo không gian\nbằng nghệ thuật kính",
        subtitle: "Giải pháp decal kính & kiến trúc kính cao cấp cho không gian văn phòng, thương mại và nhà ở.",
        image: IMG("hero"), ctaText: "Nhận tư vấn ngay", ctaLink: "/lien-he",
      }},
      { type: "productsFeatured", order: 1, data: { title: "Sản phẩm nổi bật" } },
      { type: "projectsFeatured", order: 2, data: { title: "Dự án tiêu biểu" } },
      { type: "postsFeatured", order: 3, data: { title: "Tin tức mới nhất" } },
      { type: "cta", order: 4, data: {
        title: "Bạn đã sẵn sàng để thay đổi không gian?",
        description: "Liên hệ ngay để nhận khảo sát miễn phí và báo giá chi tiết cho giải pháp decal kính nghệ thuật chuyên nghiệp nhất.",
        ctaText: "Nhận tư vấn ngay", ctaLink: "/lien-he",
      }},
    ],
  });

  await Page.create({
    slug: "gioi-thieu",
    title: "Giới thiệu",
    blocks: [
      { type: "hero", order: 0, data: { title: "Về Lucent Glass", subtitle: "Định hình tương lai không gian kiến trúc qua nghệ thuật kính.", image: IMG("about") } },
      { type: "richtext", order: 1, data: { html: "<p>Lucent Glass là đơn vị tiên phong trong lĩnh vực decal kính và giải pháp kiến trúc kính tại Việt Nam, với hơn 10 năm kinh nghiệm phục vụ hàng trăm dự án văn phòng, thương mại và nhà ở.</p>" } },
      { type: "stats", order: 2, data: { items: [
        { number: "500+", label: "Dự án hoàn thành" },
        { number: "10+", label: "Năm kinh nghiệm" },
        { number: "50+", label: "Đối tác chiến lược" },
        { number: "100%", label: "Khách hàng hài lòng" },
      ]}},
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

  await Page.create({
    slug: "chinh-sach-bao-mat",
    title: "Chính sách bảo mật",
    blocks: [{ type: "richtext", order: 0, data: { html: "<p>Lucent Glass tôn trọng và bảo vệ thông tin cá nhân của khách hàng. Mọi dữ liệu thu thập qua form liên hệ, đặt hàng chỉ được sử dụng để tư vấn, xử lý đơn hàng và không chia sẻ cho bên thứ ba khi chưa có sự đồng ý của khách hàng.</p>" } }],
  });

  await Page.create({
    slug: "dieu-khoan",
    title: "Điều khoản dịch vụ",
    blocks: [{ type: "richtext", order: 0, data: { html: "<p>Khi sử dụng website và dịch vụ của Lucent Glass, khách hàng đồng ý với các điều khoản về đặt hàng, thanh toán, bảo hành và khiếu nại được quy định tại đây. Vui lòng liên hệ bộ phận CSKH để biết thêm chi tiết.</p>" } }],
  });

  // 7. Posts (Tin tức)
  await Post.deleteMany({});
  const posts = [
    {
      title: "5 xu hướng decal kính kiến trúc năm 2026",
      category: catTinTuc._id,
      excerpt: "Khám phá những xu hướng decal kính đang được ưa chuộng nhất trong thiết kế văn phòng và không gian thương mại hiện đại.",
      content: "<p>Decal kính không chỉ mang tính thẩm mỹ mà còn giúp tối ưu ánh sáng và sự riêng tư cho không gian làm việc. Dưới đây là những xu hướng nổi bật năm 2026...</p><h2>1. Hoạ tiết hình học tối giản</h2><p>Các mẫu hoạ tiết hình học đơn giản, tinh tế đang lên ngôi nhờ khả năng phù hợp với nhiều phong cách nội thất khác nhau.</p><h2>2. Decal mờ phun cát</h2><p>Mang lại cảm giác riêng tư mà vẫn giữ được ánh sáng tự nhiên xuyên qua không gian.</p>",
      tags: ["xu-huong", "decal-kinh", "thiet-ke"],
      isFeatured: true,
    },
    {
      title: "Hướng dẫn bảo quản và vệ sinh decal kính đúng cách",
      category: catTinTuc._id,
      excerpt: "Những lưu ý quan trọng giúp decal kính của bạn luôn bền đẹp theo thời gian.",
      content: "<p>Để decal kính giữ được độ bền và thẩm mỹ lâu dài, việc vệ sinh và bảo quản đúng cách là rất quan trọng...</p><h2>Dụng cụ vệ sinh phù hợp</h2><p>Nên sử dụng khăn mềm, dung dịch lau kính chuyên dụng, tránh các vật liệu có tính mài mòn.</p>",
      tags: ["bao-quan", "meo-vat"],
    },
    {
      title: "Lucent Glass khai trương showroom mới tại TP.HCM",
      category: catThongBao._id,
      excerpt: "Showroom mới với không gian trưng bày đa dạng các mẫu decal và kính nghệ thuật, chào đón quý khách đến tham quan.",
      content: "<p>Chúng tôi vui mừng thông báo khai trương showroom mới tại Quận 1, TP.HCM, trưng bày đầy đủ các dòng sản phẩm decal kính và giải pháp kiến trúc kính mới nhất.</p>",
      tags: ["thong-bao", "su-kien"],
    },
  ];
  for (let i = 0; i < posts.length; i++) {
    const p = posts[i];
    await Post.create({
      ...p,
      slug: p.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-"),
      coverImage: IMG("post" + i),
      author: "Lucent Glass",
      publishedAt: new Date(Date.now() - i * 86400000),
    });
  }

  log.push("Đã tạo dữ liệu mẫu: cài đặt, menu, 7 danh mục, 6 sản phẩm, 3 dự án, 3 bài viết, 6 trang nội dung.");
  return log;
}

module.exports = { runSeed };
