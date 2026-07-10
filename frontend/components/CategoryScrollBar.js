import Link from "next/link";

// Dải danh mục cuộn ngang 1 hàng duy nhất (kiểu Shopee/Tiki) — gọn gàng hơn nhiều
// so với hiển thị dạng lưới nhiều hàng khi có nhiều danh mục.
export default function CategoryScrollBar({ categories, basePath, activeSlug }) {
  if (!categories?.length) return null;

  return (
    <div className="relative mb-10">
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 pr-8">
        <Link
          href={basePath}
          className={`shrink-0 whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
            !activeSlug ? "bg-secondary border-secondary" : "border-on-background/20 hover:border-on-background/40"
          }`}
        >
          Tất cả
        </Link>
        {categories.map((c) => (
          <Link
            key={c._id}
            href={`${basePath}?category=${c.slug}`}
            className={`shrink-0 whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
              activeSlug === c.slug ? "bg-secondary border-secondary" : "border-on-background/20 hover:border-on-background/40"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>
      {/* Mờ dần mép phải để gợi ý còn danh mục phía sau có thể cuộn tới */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-1 w-10 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
