import { getPage, getSettings } from "@/lib/api";

// dựng metadata cho các trang xây bằng page builder (liên hệ, giới thiệu, hồ sơ năng lực,
// trang tự tạo...): ưu tiên metaTitle/metaDescription admin đã điền ở trang quản trị, không
// có thì dùng tiêu đề/mô tả dự phòng truyền vào. canonical luôn trỏ về đường dẫn gọn "path".
export async function buildPageMetadata({ slug, path, fallbackTitle, fallbackDescription }) {
  const [page, settings] = await Promise.all([getPage(slug), getSettings()]);
  const siteName = settings?.siteName || "Website";
  const siteUrl = (settings?.seo?.siteUrl || "").replace(/\/$/, "");
  const title = page?.metaTitle || `${page?.title || fallbackTitle} | ${siteName}`;
  const description = page?.metaDescription || fallbackDescription || "";

  return {
    title,
    ...(description && { description }),
    ...(siteUrl && { alternates: { canonical: `${siteUrl}${path}` } }),
    openGraph: {
      title,
      ...(description && { description }),
      ...(siteUrl && { url: `${siteUrl}${path}` }),
      siteName,
      locale: "vi_VN",
      type: "website",
    },
  };
}
