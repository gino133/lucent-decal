import { getSettings, getProducts, getProjects, getPosts, getPublishedPages } from "@/lib/api";

// Next.js tự render file này thành /sitemap.xml thật ở route gốc — không cần cấu hình gì thêm.
// Giúp Google biết hết các trang trên site để thu thập dữ liệu (crawl) đầy đủ hơn, thay vì
// phải tự dò link — đặc biệt quan trọng với các trang sản phẩm/bài viết không có link trỏ
// tới từ trang chủ, hoặc mới đăng nên chưa được Google tìm thấy qua đường tự nhiên.
export default async function sitemap() {
  const settings = await getSettings();
  const siteUrl = (settings?.seo?.siteUrl || "").replace(/\/$/, "");
  if (!siteUrl) return []; // chưa cấu hình domain ở Cài đặt thì không sinh được URL tuyệt đối

  // lấy hết, không phân trang — số lượng sản phẩm/bài viết/dự án của 1 site vừa và nhỏ
  // không nhiều tới mức cần chia trang cho sitemap
  const [productsRes, projectsRes, postsRes, pages] = await Promise.all([
    getProducts("?limit=1000"),
    getProjects("?limit=1000"),
    getPosts("?limit=1000"),
    getPublishedPages(),
  ]);

  // các trang cố định (kể cả 3 trang dựng bằng page builder có slug cố định) chỉ liệt kê 1 lần
  // ở đây, kèm ngày sửa lấy từ dữ liệu trang nếu có — tránh trùng URL với danh sách trang tự tạo bên dưới
  const pageUpdatedAt = Object.fromEntries((pages || []).map((pg) => [pg.slug, pg.updatedAt]));
  const FIXED_PAGE_SLUGS = ["gioi-thieu", "lien-he", "ho-so-nang-luc"];
  const staticRoutes = ["", "/san-pham", "/du-an", "/tin-tuc", ...FIXED_PAGE_SLUGS.map((s) => `/${s}`)].map((path) => ({
    url: `${siteUrl}${path}`,
    ...(pageUpdatedAt[path.slice(1)] && { lastModified: pageUpdatedAt[path.slice(1)] }),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const productUrls = (productsRes?.items || []).map((p) => ({
    url: `${siteUrl}/san-pham/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const projectUrls = (projectsRes?.items || []).map((p) => ({
    url: `${siteUrl}/du-an/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const postUrls = (postsRes?.items || []).map((p) => ({
    url: `${siteUrl}/tin-tuc/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // trang tự tạo (page builder) — bỏ "home" và 3 trang cố định vì đã có trong staticRoutes
  const customPageUrls = (pages || [])
    .filter((pg) => pg.slug !== "home" && !FIXED_PAGE_SLUGS.includes(pg.slug))
    .map((pg) => ({
      url: `${siteUrl}/${pg.slug}`,
      lastModified: pg.updatedAt,
      changeFrequency: "monthly",
      priority: 0.5,
    }));

  return [...staticRoutes, ...productUrls, ...projectUrls, ...postUrls, ...customPageUrls];
}
