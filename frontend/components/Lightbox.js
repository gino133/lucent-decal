"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const TRANSITION_MS = 200;

// pop-up phóng to ảnh, có hiệu ứng mờ dần lúc mở/đóng/chuyển ảnh cho mượt.
// Bấm bất kỳ đâu trên ảnh/nền đen đều tắt (trên điện thoại gần như không có "vùng trống"
// quanh ảnh nên cho bấm cả vào ảnh luôn cho chắc) — chỉ 3 nút điều khiển mới không tắt popup.
// dùng: <Lightbox images={[{src,alt}]} startIndex={0} onClose={(lastIndex) => ...} />
export default function Lightbox({ images, startIndex = 0, onClose }) {
  const [current, setCurrent] = useState(startIndex);
  const [visible, setVisible] = useState(false); // để trigger transition mờ dần khi mở
  const [closing, setClosing] = useState(false); // để chạy hiệu ứng mờ dần trước khi thật sự đóng
  const [imgKey, setImgKey] = useState(0); // đổi key để mỗi lần chuyển ảnh cũng có fade nhẹ
  const hasMultiple = images.length > 1;

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  function requestClose() {
    setVisible(false);
    setClosing(true);
    setTimeout(() => onClose(current), TRANSITION_MS);
  }

  function next() { setCurrent((i) => (i + 1) % images.length); setImgKey((k) => k + 1); }
  function prev() { setCurrent((i) => (i - 1 + images.length) % images.length); setImgKey((k) => k + 1); }

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") requestClose();
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
      className={`fixed inset-0 z-[100] bg-black/90 h-[100dvh] w-screen overflow-hidden transition-opacity duration-200 ${visible && !closing ? "opacity-100" : "opacity-0"}`}
      onClick={requestClose}
    >
      <button
        onClick={(e) => { e.stopPropagation(); requestClose(); }}
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
        <Image
          key={imgKey}
          src={images[current].src}
          alt={images[current].alt || ""}
          fill
          className="object-contain transition-opacity duration-150 opacity-0 animate-[fadein_150ms_ease-out_forwards]"
          sizes="100vw"
        />
      </div>

      {hasMultiple && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white/70 text-sm">{current + 1} / {images.length}</div>
      )}
    </div>
  );
}
