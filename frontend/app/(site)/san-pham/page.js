import Link from "next/link";
import { getProducts, getCategories, getSettings } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import CategoryScrollBar from "@/components/CategoryScrollBar";
import ProductFilterBar from "@/components/ProductFilterBar";

export default async function ProductsPage({ searchParams }) {
  const category = searchParams?.category || "";
  const origin = searchParams?.origin || "";
  const sort = searchParams?.sort || "";
  const page = Number(searchParams?.page || 1);
  const qs = new URLSearchParams({
    page, limit: 16,
    ...(category ? { category } : {}),
    ...(origin ? { origin } : {}),
    ...(sort ? { sort } : {}),
  }).toString();

  const [res, categories, settings] = await Promise.all([
    getProducts(`?${qs}`),
    getCategories("product"),
    getSettings(),
  ]);
  const products = res?.items || [];
  const extraParams = new URLSearchParams({
    ...(category ? { category } : {}),
    ...(origin ? { origin } : {}),
    ...(sort ? { sort } : {}),
  }).toString();

  return (
    <div className="pt-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-20">
      <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Sản phẩm</h1>
      <p className="text-on-background/60 mb-8">Danh sách sản phẩm của chúng tôi.</p>

      <CategoryScrollBar categories={categories} basePath="/san-pham" activeSlug={category} />
      <ProductFilterBar origins={settings?.productOrigins || []} />

      {products.length === 0 ? (
        <p className="text-on-background/50 text-center py-20">Chưa có sản phẩm nào phù hợp với bộ lọc.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}

      {res?.total > 0 && (
        <p className="text-center text-sm text-on-background/50 mt-10">
          Đang hiển thị {products.length} trên tổng số {res.total} sản phẩm
        </p>
      )}

      {res?.pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: res.pages }, (_, i) => (
            <Link
              key={i}
              href={`/san-pham?page=${i + 1}${extraParams ? `&${extraParams}` : ""}`}
              className={`w-9 h-9 flex items-center justify-center rounded-full border text-sm ${page === i + 1 ? "bg-secondary border-secondary" : "border-on-background/20"}`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
