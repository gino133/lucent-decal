import { getPage, getSettings } from "@/lib/api";
import BlockRenderer from "@/components/BlockRenderer";

// trang chủ ("home") đã có sẵn 2 ô metaTitle/metaDescription riêng trong trang quản trị
// (Trang > sửa trang chủ) từ trước, nhưng chưa từng được dùng tới — trước đây trang chủ
// luôn hiện tiêu đề mặc định lấy từ Cài đặt chung. Giờ ưu tiên dùng đúng 2 ô đó nếu
// admin đã điền, không thì mới rơi về mặc định (vốn do root layout.js xử lý sẵn).
export async function generateMetadata() {
  const page = await getPage("home");
  if (!page?.metaTitle && !page?.metaDescription) return {}; // chưa điền gì thì giữ mặc định của layout.js

  const settings = await getSettings();
  const siteUrl = (settings?.seo?.siteUrl || "").replace(/\/$/, "");
  const title = page.metaTitle || undefined;
  const description = page.metaDescription || undefined;

  return {
    ...(title && { title }),
    ...(description && { description }),
    ...(siteUrl && { alternates: { canonical: `${siteUrl}/` } }),
    openGraph: { ...(title && { title }), ...(description && { description }) },
    twitter: { ...(title && { title }), ...(description && { description }) },
  };
}

export default async function HomePage() {
  const page = await getPage("home");

  if (!page) {
    return (
      <div className="pt-40 text-center px-margin-mobile">
        <h1 className="font-heading text-3xl font-bold mb-4">Chào mừng</h1>
        <p className="text-on-background/60">
          Chưa có nội dung trang chủ. Vào <code>/admin</code> để thiết lập nội dung.
        </p>
      </div>
    );
  }

  return <BlockRenderer blocks={page.blocks} />;
}
