"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

// pop-up phóng to ảnh. Bấm bất kỳ đâu trên ảnh/nền đen đều tắt (trên điện thoại gần như
// không có "vùng trống" quanh ảnh nên cho bấm cả vào ảnh luôn cho chắc ăn) — chỉ 3 nút
// điều khiển (đóng, trước, sau) mới không tắt popup khi bấm.
// dùng: <Lightbox images={[{src,alt}]} startIndex={0} onClose={(lastIndex) => ...} />
export default function Lightbox({ images, startIndex = 0, onClose }) {
  const [current, setCurrent] = useState(startIndex);
  const hasMultiple = images.length > 1;

  function next() { setCurrent((i) => (i + 1) % images.length); }
  function prev() { setCurrent((i) => (i - 1 + images.length) % images.length); }

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose(current);
      if (e.key === "ArrowRight" && hasMultiple) next();
      if (e.key === "ArrowLeft" && hasMultiple) prev();
    }
    document.addEventListener("keydown", handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [current]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 h-[100dvh] w-screen overflow-hidden"
      onClick={() => onClose(current)}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onClose(current); }}
        className="absolute top-3 right-3 z-10 text-white/90 hover:text-white bg-black/40 rounded-full w-11 h-11 flex items-center justify-center"
        aria-label="Đóng"
      >
        <span className="material-symbols-outlined text-2xl">close</span>
      </button>

      {hasMultiple && (
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-1 md:left-4 top-1/2 -translate-y-1/2 z-10 text-white/90 hover:text-white bg-black/40 rounded-full w-11 h-11 flex items-center justify-center"
          aria-label="Ảnh trước"
        >
          <span className="material-symbols-outlined text-3xl">chevron_left</span>
        </button>
      )}

      {hasMultiple && (
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-1 md:right-4 top-1/2 -translate-y-1/2 z-10 text-white/90 hover:text-white bg-black/40 rounded-full w-11 h-11 flex items-center justify-center"
          aria-label="Ảnh sau"
        >
          <span className="material-symbols-outlined text-3xl">chevron_right</span>
        </button>
      )}

      {/* khung ảnh: kích thước cố định theo inset, không phụ thuộc flex nên không bao giờ tràn màn hình */}
      <div className="absolute inset-4 md:inset-16">
        <Image src={images[current].src} alt={images[current].alt || ""} fill className="object-contain" sizes="100vw" />
      </div>

      {hasMultiple && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white/70 text-sm">{current + 1} / {images.length}</div>
      )}
    </div>
  );
}
