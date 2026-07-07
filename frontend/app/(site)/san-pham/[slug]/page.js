import Image from "next/image";
import Link from "next/link";
import { getProduct, getProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import AddToCartBox from "@/components/AddToCartBox";
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

      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-surface">
            {product.images?.[0] && (
              <Image src={product.images[0]} alt={product.name} fill className="object-cover" priority />
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.slice(1, 5).map((img, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-surface">
                  <Image src={img} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.category?.name && (
            <span className="text-xs uppercase tracking-widest text-secondary font-bold">{product.category.name}</span>
          )}
          <h1 className="font-heading text-3xl md:text-4xl font-bold mt-2 mb-4">{product.name}</h1>
          <p className="text-on-background/70 mb-6">{product.shortDescription}</p>
          <div className="text-2xl font-bold mb-6">
            {product.price?.toLocaleString("vi-VN")}đ
            <span className="text-sm font-normal text-on-background/50"> / {product.unit}</span>
          </div>

          <AddToCartBox product={product} />

          {product.specs?.length > 0 && (
            <div className="mt-10">
              <h3 className="font-heading font-semibold text-lg mb-3">Thông số kỹ thuật</h3>
              <table className="w-full text-sm">
                <tbody>
                  {product.specs.map((s, i) => (
                    <tr key={i} className="border-b border-on-background/10">
                      <td className="py-2 text-on-background/60 w-1/3">{s.label}</td>
                      <td className="py-2 font-medium">{s.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

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
