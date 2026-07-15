import Link from "next/link";
import { getProduct, getProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import ProductDetailInteractive from "@/components/ProductDetailInteractive";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({ params }) {
  const product = await getProduct(params.slug);
  if (!product) return notFound();

  const related = await getProducts(`?category=${product.category?._id || ""}&limit=4`);

  return (
    <div className="pt-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-20">
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
        <div className="rich-content max-w-3xl mt-16" dangerouslySetInnerHTML={{ __html: product.description }} />
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
