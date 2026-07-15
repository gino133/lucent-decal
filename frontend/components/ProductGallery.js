"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Lightbox from "./Lightbox";

// ảnh sản phẩm: bấm thumbnail nhỏ để đổi ảnh lớn phía trên, bấm ảnh lớn để mở pop-up phóng to.
// overrideImage (tuỳ chọn): khi khách đổi màu/size ở bên cạnh, truyền ảnh riêng của biến thể đó
// vào đây thì ảnh lớn tự đổi theo, không cần khách bấm thumbnail.
export default function ProductGallery({ images = [], name, overrideImage }) {
  const [selected, setSelected] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const mainSrc = overrideImage || images[selected] || images[0];

  // ảnh biến thể không nằm trong mảng ảnh chính thì thêm tạm vào đầu danh sách pop-up
  const lightboxImages = images.map((src) => ({ src, alt: name }));
  if (overrideImage && !images.includes(overrideImage)) {
    lightboxImages.unshift({ src: overrideImage, alt: name });
  }
  const lightboxStartIndex = overrideImage
    ? lightboxImages.findIndex((img) => img.src === overrideImage)
    : selected;

  if (!mainSrc) return <div className="w-full aspect-[4/3] rounded-2xl bg-surface" />;

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="relative block w-full aspect-[4/3] rounded-2xl overflow-hidden bg-surface cursor-zoom-in"
        aria-label="Xem ảnh lớn"
      >
        <Image src={mainSrc} alt={name} fill className="object-cover" priority />
      </button>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.slice(0, 8).map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(i)}
              className={`relative aspect-square rounded-lg overflow-hidden bg-surface border-2 transition-colors ${
                !overrideImage && selected === i ? "border-secondary" : "border-transparent"
              }`}
            >
              <Image src={img} alt={`${name} ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <Lightbox
          images={lightboxImages}
          startIndex={Math.max(0, lightboxStartIndex)}
          onClose={(lastIndex) => {
            setLightboxOpen(false);
            // khách lỡ chuyển ảnh trong pop-up thì thumbnail bên ngoài cũng đổi theo cho khớp
            if (!overrideImage) setSelected(lastIndex);
          }}
        />
      )}
    </div>
  );
}
