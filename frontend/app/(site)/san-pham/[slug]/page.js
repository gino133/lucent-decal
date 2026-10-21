import Link from "next/link";
import { getProduct, getProducts, getPosts, getSettings } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import PostCard from "@/components/PostCard";
import ProductDetailInteractive from "@/components/ProductDetailInteractive";
import ProductSchema from "@/components/ProductSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FaqSchema from "@/components/FaqSchema";
import { sanitizeRichHtml, extractFaqPairs, stripHtmlTags } from "@/lib/richtext";
import { notFound } from "next/navigation";

// tiêu đề/mô tả RIÊNG cho từng sản phẩm, thay vì dùng chung 1 cái cho cả site (trước
// đây mọi trang đều hiện cùng 1 title lấy từ Cài đặt chung) — mỗi sản phẩm giờ có tín
// hiệu SEO riêng, Google phân biệt và xếp hạng được từng trang độc lập
export async function generateMetadata({ params }) {
  const [product, settings] = await Promise.all([getProduct(params.slug), getSettings()]);
  if (!product) return {};

  const siteName = settings?.siteName || "Website";
  const title = `${product.name} | ${siteName}`;
  const plainDesc = stripHtmlTags(product.shortDescription || product.description || "");
  const description = plainDesc
    ? plainDesc.slice(0, 160)
    : `${product.name}${product.origin ? ` - xuất xứ ${product.origin}` : ""}. Giá ${product.price?.toLocaleString("vi-VN")}đ tại ${siteName}.`;
  const siteUrl = (settings?.seo?.siteUrl || "").replace(/\/$/, "");
  const url = siteUrl ? `${siteUrl}/san-pham/${product.slug}` : undefined;
  const image = product.images?.[0];

  return {
    title,
    description,
    ...(url && { alternates: { canonical: url } }),
    openGraph: {
      title,
      description,
      ...(url && { url }),
      siteName,
      locale: "vi_VN",
      type: "website",
      ...(image && { images: [{ url: image }] }),
    },
    twitter: { card: "summary_large_image", title, description, ...(image && { images: [image] }) },
  };
}

export default async function ProductDetailPage({ params }) {
  const [product, settings] = await Promise.all([getProduct(params.slug), getSettings()]);
  if (!product) return notFound();

  const siteUrl = (settings?.seo?.siteUrl || "").replace(/\/$/, "");
  const cleanDescription = sanitizeRichHtml(product.description);
  const faqs = extractFaqPairs(cleanDescription);
  const breadcrumbItems = [
    { name: "Trang chủ", url: siteUrl ? `${siteUrl}/` : undefined },
    { name: "Sản phẩm", url: siteUrl ? `${siteUrl}/san-pham` : undefined },
    ...(product.category?.name
      ? [{ name: product.category.name, url: siteUrl ? `${siteUrl}/san-pham?category=${product.category.slug}` : undefined }]
      : []),
    { name: product.name },
  ];

  const related = await getProducts(`?category=${product.category?._id || ""}&limit=4`);

  // gắn link nội bộ từ sản phẩm sang bài hướng dẫn/kiến thức mới nhất — khách còn phân
  // vân (bền không, chống nước không...) đọc bài rồi quay lại mua, Google cũng thấy 2 loại trang nối với nhau
  const guidesRes = await getPosts(`?limit=3`);
  const guides = guidesRes?.items || [];

  return (
    <div className="pt-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-20">
      <ProductSchema product={product} siteUrl={siteUrl} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <FaqSchema faqs={faqs} />

      <div className="text-sm text-on-background/50 mb-8 flex items-center gap-1 flex-wrap">
        <Link href="/" className="hover:text-secondary hover:underline">Trang chủ</Link>
        <span>/</span>
        <Link href="/san-pham" className="hover:text-secondary hover:underline">Sản phẩm</Link>
        {product.category?.name && (
          <>
            <span>/</span>
            <Link href={`/san-pham?category=${product.category.slug}`} className="hover:text-secondary hover:underline">
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-on-background">{product.name}</span>
      </div>

      <ProductDetailInteractive product={product} />

      {product.description && (
        <div className="rich-content max-w-3xl mt-16" dangerouslySetInnerHTML={{ __html: cleanDescription }} />
      )}

      {related?.items?.length > 1 && (
        <div className="mt-20">
          <h2 className="font-heading text-2xl font-bold mb-8">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.items.filter((p) => p._id !== product._id).slice(0, 4).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

      {guides.length > 0 && (
        <div className="mt-20">
          <div className="flex items-end justify-between gap-4 mb-8">
            <h2 className="font-heading text-2xl font-bold">Hướng dẫn &amp; kiến thức film dán nội thất</h2>
            <Link href="/tin-tuc" className="text-sm font-semibold underline whitespace-nowrap">Xem tất cả bài viết →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {guides.map((p) => <PostCard key={p._id} post={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
