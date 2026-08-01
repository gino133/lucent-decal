import Link from "next/link";
import { getProduct, getProducts, getSettings } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import ProductDetailInteractive from "@/components/ProductDetailInteractive";
import ProductSchema from "@/components/ProductSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FaqSchema from "@/components/FaqSchema";
import { sanitizeRichHtml, extractFaqPairs } from "@/lib/richtext";
import { notFound } from "next/navigation";

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
    </div>
  );
}
