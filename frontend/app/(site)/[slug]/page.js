import { getPage, getSettings } from "@/lib/api";
import BlockRenderer from "@/components/BlockRenderer";
import { notFound } from "next/navigation";

// tiêu đề/mô tả riêng cho từng trang tự tạo — ưu tiên metaTitle/metaDescription nếu
// admin đã điền riêng ở trang quản trị, không thì dùng title của trang làm tiêu đề
export async function generateMetadata({ params }) {
  const [page, settings] = await Promise.all([getPage(params.slug), getSettings()]);
  if (!page) return {};

  const siteName = settings?.siteName || "Website";
  const siteUrl = (settings?.seo?.siteUrl || "").replace(/\/$/, "");
  const title = page.metaTitle || `${page.title} | ${siteName}`;
  const description = page.metaDescription || "";
  const url = siteUrl ? `${siteUrl}/${page.slug}` : undefined;

  return {
    title,
    ...(description && { description }),
    ...(url && { alternates: { canonical: url } }),
    openGraph: { title, ...(description && { description }), ...(url && { url }), siteName, locale: "vi_VN", type: "website" },
  };
}

// route bắt hết cho trang tự tạo ở /admin/trang, cho đường dẫn gọn /<slug>.
// Next.js ưu tiên route cố định trước nên không đụng gì các trang có sẵn.
export default async function CustomRootPage({ params }) {
  const page = await getPage(params.slug);
  if (!page) return notFound();

  return (
    <div className="pt-32 pb-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <h1 className="font-heading text-3xl md:text-4xl font-bold mb-10">{page.title}</h1>
      <BlockRenderer blocks={page.blocks} />
    </div>
  );
}
