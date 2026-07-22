"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const SORT_LABELS = {
  newest: "Mới nhất",
  price_asc: "Giá: Thấp đến cao",
  price_desc: "Giá: Cao đến thấp",
};

// nút "Bộ lọc & Sắp xếp" mở ra bảng chọn danh mục + xuất xứ + kiểu sắp xếp,
// gộp chung tất cả bộ lọc vào một chỗ cho gọn gàng.
export default function ProductFilterBar({ categories = [], basePath = "", origins = [] }) {
  return (
    <Suspense fallback={<div className="h-10 mb-6" />}>
      <ProductFilterBarInner categories={categories} basePath={basePath} origins={origins} />
    </Suspense>
  );
}

function ProductFilterBarInner({ categories = [], basePath = "", origins = [] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "newest";
  const currentOrigins = (searchParams.get("origin") || "").split(",").filter(Boolean);
  const activeCount =
    (currentCategory ? 1 : 0) + (currentSort !== "newest" ? 1 : 0) + currentOrigins.length;

  function buildUrl(next) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (!value) params.delete(key);
      else params.set(key, value);
    });
    params.delete("page"); // đổi bộ lọc thì quay lại trang 1
    return `${pathname}?${params.toString()}`;
  }

  function setCategory(slug) {
    router.push(buildUrl({ category: slug || null }));
  }

  function setSort(value) {
    router.push(buildUrl({ sort: value === "newest" ? null : value }));
  }

  function toggleOrigin(value) {
    const next = currentOrigins.includes(value)
      ? currentOrigins.filter((o) => o !== value)
      : [...currentOrigins, value];
    router.push(buildUrl({ origin: next.join(",") }));
  }

  function clearAll() {
    router.push(buildUrl({ category: null, sort: null, origin: null }));
    setOpen(false);
  }

  return (
    <div className="relative mb-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border border-on-background/20 hover:border-on-background/40"
      >
        <span className="material-symbols-outlined text-lg">tune</span>
        Bộ lọc & Sắp xếp
        {activeCount > 0 && (
          <span className="bg-secondary text-on-background text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-2 z-40 w-72 max-w-[85vw] bg-white border border-on-background/10 rounded-xl shadow-lg p-5 max-h-[70vh] overflow-y-auto">
            {categories.length > 0 && (
              <div className="mb-5">
                <p className="text-sm font-semibold mb-2">Danh mục</p>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" checked={!currentCategory} onChange={() => setCategory("")} />
                    Tất cả
                  </label>
                  {categories.map((c) => (
                    <label key={c._id} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="radio" checked={currentCategory === c.slug} onChange={() => setCategory(c.slug)} />
                      {c.name}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-5">
              <p className="text-sm font-semibold mb-2">Sắp xếp theo</p>
              <div className="space-y-1.5">
                {Object.entries(SORT_LABELS).map(([value, label]) => (
                  <label key={value} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" checked={currentSort === value} onChange={() => setSort(value)} />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {origins.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-semibold mb-2">Xuất xứ</p>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {origins.map((o) => (
                    <label key={o} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={currentOrigins.includes(o)} onChange={() => toggleOrigin(o)} />
                      {o}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <button type="button" onClick={clearAll} className="text-xs text-on-background/50 hover:text-on-background underline">
              Xoá hết bộ lọc
            </button>
          </div>
        </>
      )}
    </div>
  );
}
