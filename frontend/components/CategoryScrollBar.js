"use client";
import { useRef } from "react";
import Link from "next/link";

// dải danh mục cuộn ngang 1 hàng (kiểu Shopee/Tiki), có nút mũi tên cho desktop
// (không cho kéo-thả trực tiếp vì dễ đụng với việc bấm chọn danh mục)
export default function CategoryScrollBar({ categories, basePath, activeSlug }) {
  const scrollRef = useRef(null);

  function scrollByAmount(direction) {
    scrollRef.current?.scrollBy({ left: direction * 260, behavior: "smooth" });
  }

  if (!categories?.length) return null;

  return (
    <div className="relative mb-10 group/scrollbar">
      <div ref={scrollRef} className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 md:px-10">
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

      {/* Mờ dần 2 mép để gợi ý còn danh mục có thể cuộn tới */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-1 w-10 bg-gradient-to-r from-background to-transparent hidden md:block" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-1 w-10 bg-gradient-to-l from-background to-transparent" />

      {/* Nút mũi tên — chỉ hiện trên desktop/tablet (mobile vuốt trực tiếp bằng tay đã mượt) */}
      <button
        type="button"
        onClick={() => scrollByAmount(-1)}
        aria-label="Cuộn danh mục sang trái"
        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/3 w-8 h-8 rounded-full bg-background border border-on-background/20 shadow items-center justify-center hover:bg-surface z-10"
      >
        <span className="material-symbols-outlined text-lg">chevron_left</span>
      </button>
      <button
        type="button"
        onClick={() => scrollByAmount(1)}
        aria-label="Cuộn danh mục sang phải"
        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 w-8 h-8 rounded-full bg-background border border-on-background/20 shadow items-center justify-center hover:bg-surface z-10"
      >
        <span className="material-symbols-outlined text-lg">chevron_right</span>
      </button>
    </div>
  );
}
