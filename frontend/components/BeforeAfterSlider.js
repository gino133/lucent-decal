"use client";
import { useRef, useState, useCallback } from "react";
import Image from "next/image";

// kéo thanh này (chuột hoặc chạm) để so sánh ảnh trước/sau
export default function BeforeAfterSlider({ before, after, caption }) {
  const [position, setPosition] = useState(50); // % vị trí thanh trượt, từ trái sang
  const containerRef = useRef(null);
  const dragging = useRef(false);

  const updatePosition = useCallback((clientX) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  function handleMouseDown(e) {
    dragging.current = true;
    updatePosition(e.clientX);
  }
  function handleMouseMove(e) {
    if (!dragging.current) return;
    updatePosition(e.clientX);
  }
  function stopDragging() {
    dragging.current = false;
  }
  function handleTouchStart(e) {
    dragging.current = true;
    updatePosition(e.touches[0].clientX);
  }
  function handleTouchMove(e) {
    if (!dragging.current) return;
    updatePosition(e.touches[0].clientX);
  }

  return (
    <div>
      <div
        ref={containerRef}
        className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden select-none cursor-ew-resize touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={stopDragging}
      >
        {/* Ảnh "Sau" làm nền, phủ toàn bộ khung */}
        <Image src={after} alt={caption ? `${caption} - sau` : "Sau"} fill className="object-cover pointer-events-none" draggable={false} />

        {/* Ảnh "Trước" chỉ lộ ra phần bên trái thanh trượt, dùng clip-path để luôn khớp kích thước khung ảnh */}
        <div className="absolute inset-0 pointer-events-none" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <Image src={before} alt={caption ? `${caption} - trước` : "Trước"} fill className="object-cover" draggable={false} />
        </div>

        {/* Nhãn Trước / Sau */}
        <span className="absolute top-3 left-3 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded pointer-events-none">TRƯỚC</span>
        <span className="absolute top-3 right-3 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded pointer-events-none">SAU</span>

        {/* Vạch + nút kéo */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-white pointer-events-none" style={{ left: `${position}%` }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-base text-on-background">swap_horiz</span>
          </div>
        </div>
      </div>
      {caption && <p className="text-sm text-on-background/60 mt-3 text-center">{caption}</p>}
    </div>
  );
}
