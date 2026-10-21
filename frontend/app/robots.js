import { getSettings } from "@/lib/api";

// Next.js tự render file này thành /robots.txt thật ở route gốc.
// Quan trọng nhất: chặn Google thu thập (và lỡ hiển thị trong kết quả tìm kiếm)
// khu vực quản trị /admin — trước đây không có robots.txt nên không có gì ngăn cả.
export default async function robots() {
  const settings = await getSettings();
  const siteUrl = (settings?.seo?.siteUrl || "").replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // "/trang/" (có dấu / cuối) vì Disallow khớp theo tiền tố — viết "/trang" sẽ chặn nhầm cả /trang-tri-noi-that...
      // /trang/* trùng nội dung với /<slug> (route gọn hơn, đã có trong sitemap) —
      // chặn để tránh Google thấy 2 URL khác nhau cùng 1 nội dung (duplicate content)
      disallow: ["/admin", "/gio-hang", "/checkout", "/trang/"],
    },
    ...(siteUrl && { sitemap: `${siteUrl}/sitemap.xml` }),
  };
}
