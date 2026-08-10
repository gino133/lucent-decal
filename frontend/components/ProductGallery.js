"use client";
import { useState } from "react";
import Image from "next/image";
import Lightbox from "./Lightbox";

// ảnh sản phẩm: bấm thumbnail nhỏ để đổi ảnh lớn phía trên, bấm ảnh lớn để mở pop-up phóng to.
// overrideImage: ảnh đang được hiển thị lớn + thumbnail nào đang tô sáng — do component cha
// (ProductDetailInteractive) quyết định, để đồng bộ 2 chiều với khung chọn "Mã hàng" bên cạnh:
// bấm tuỳ chọn thì ảnh này đổi, mà bấm thumbnail ở đây thì tuỳ chọn bên đó cũng tự đổi theo.
export default function ProductGallery({ images = [], name, overrideImage, onThumbnailSelect }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const mainSrc = overrideImage || images[0];
  // ảnh đang hiển thị trùng đúng 1 thumbnail nào thì tô sáng thumbnail đó; không có
  // overrideImage (chưa bấm gì) thì mặc định tô sáng ảnh đầu tiên
  const highlightIndex = overrideImage ? images.indexOf(overrideImage) : 0;

  // ảnh biến thể không nằm trong mảng ảnh chính thì thêm tạm vào đầu danh sách pop-up
  const lightboxImages = images.map((src) => ({ src, alt: name }));
  if (overrideImage && !images.includes(overrideImage)) {
    lightboxImages.unshift({ src: overrideImage, alt: name });
  }
  const lightboxStartIndex = overrideImage
    ? lightboxImages.findIndex((img) => img.src === overrideImage)
    : 0;

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
        // giới hạn đúng 2 hàng, nhiều hơn thì cuộn dọc bên trong khung này (không đẩy
        // dài cả trang) — "thumb-scroll" ở globals.css làm thanh cuộn hiện rõ, dễ thấy
        // hơn thanh cuộn mặc định vốn rất mảnh và mờ của trình duyệt
        <div className="grid grid-cols-4 gap-3 max-h-[190px] sm:max-h-[210px] md:max-h-[230px] overflow-y-auto pr-1.5 thumb-scroll">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onThumbnailSelect?.(img)}
              className={`relative aspect-square rounded-lg overflow-hidden bg-surface border-2 transition-colors ${
                highlightIndex === i ? "border-secondary" : "border-transparent"
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
            // khách lỡ chuyển ảnh trong pop-up thì ảnh lớn + tuỳ chọn bên ngoài cũng đổi theo cho khớp
            const newImg = lightboxImages[lastIndex]?.src;
            if (newImg) onThumbnailSelect?.(newImg);
          }}
        />
      )}
    </div>
  );
}
