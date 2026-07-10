import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ product }) {
  const hasVariants = product.variants?.length > 0;
  const minPrice = hasVariants ? Math.min(...product.variants.map((v) => v.price)) : product.price;

  return (
    <Link
      href={`/san-pham/${product.slug}`}
      className="group block rounded-xl overflow-hidden border border-on-background/10 hover:shadow-lg transition-shadow bg-white"
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-surface">
        {product.images?.[0] && (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width:768px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        {product.isNew && (
          <span className="absolute top-3 left-3 bg-secondary text-on-background text-xs font-bold px-2 py-1 rounded">
            Mới
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-heading font-semibold text-base mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-on-background/60 mb-2 line-clamp-2">{product.shortDescription}</p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm">
            {hasVariants && <span className="text-xs font-normal text-on-background/50">Từ </span>}
            {minPrice?.toLocaleString("vi-VN")}đ
            {!hasVariants && product.unit && <span className="text-xs font-normal text-on-background/50"> /{product.unit}</span>}
          </span>
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </div>
      </div>
    </Link>
  );
}
