"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

// pop-up phóng to ảnh, bấm ra ngoài hoặc nhấn Esc để tắt, có mũi tên chuyển ảnh nếu nhiều ảnh
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
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [current]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 md:p-10" onClick={() => onClose(current)}>
      <button onClick={() => onClose(current)} className="absolute top-4 right-4 text-white/80 hover:text-white p-2" aria-label="Đóng">
        <span className="material-symbols-outlined text-3xl">close</span>
      </button>

      {hasMultiple && (
        <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2" aria-label="Ảnh trước">
          <span className="material-symbols-outlined text-4xl">chevron_left</span>
        </button>
      )}

      <div className="relative w-full h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <Image src={images[current].src} alt={images[current].alt || ""} fill className="object-contain" sizes="100vw" />
      </div>

      {hasMultiple && (
        <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2" aria-label="Ảnh sau">
          <span className="material-symbols-outlined text-4xl">chevron_right</span>
        </button>
      )}

      {hasMultiple && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">{current + 1} / {images.length}</div>
      )}
    </div>
  );
}
