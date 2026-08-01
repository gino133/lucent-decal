import { stripHtmlTags } from "@/lib/richtext";

// sinh JSON-LD Product Schema cho trang chi tiết sản phẩm — giúp Google có thể
// hiện giá, tình trạng còn hàng ngay trên kết quả tìm kiếm. Xem thêm:
// https://schema.org/Product
export default function ProductSchema({ product, siteUrl }) {
  if (!product) return null;

  // sản phẩm có biến thể thì lấy khoảng giá thấp nhất - cao nhất trong các biến thể,
  // không thì dùng giá cơ bản (price) làm cả 2 đầu khoảng giá
  const variantPrices = (product.variants || []).map((v) => v.price).filter((p) => typeof p === "number");
  const lowPrice = variantPrices.length > 0 ? Math.min(...variantPrices) : product.price;
  const highPrice = variantPrices.length > 0 ? Math.max(...variantPrices) : product.price;
  const inStock = (product.stock ?? 999) > 0;
  const url = siteUrl ? `${siteUrl}/san-pham/${product.slug}` : undefined;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    ...(product.shortDescription || product.description
      ? { description: stripHtmlTags(product.shortDescription || product.description).slice(0, 500) }
      : {}),
    ...(product.images?.length > 0 && { image: product.images }),
    ...(url && { url }),
    ...(product.origin && { brand: { "@type": "Brand", name: product.origin } }),
    offers: {
      "@type": lowPrice !== highPrice ? "AggregateOffer" : "Offer",
      priceCurrency: "VND",
      ...(lowPrice !== highPrice
        ? { lowPrice, highPrice }
        : { price: lowPrice }),
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      ...(url && { url }),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
