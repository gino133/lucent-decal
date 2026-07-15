"use client";
import { useState } from "react";
import Image from "next/image";
import Lightbox from "./Lightbox";

// ảnh bấm vào sẽ mở pop-up phóng to. Truyền "images" (mảng {src,alt}) + "index"
// nếu ảnh này nằm trong 1 bộ nhiều ảnh, để pop-up chuyển qua lại được giữa các ảnh đó.
export default function ClickableImage({ src, alt = "", images, index = 0, className, imgClassName, sizes, priority }) {
  const [open, setOpen] = useState(false);
  const gallery = images && images.length > 0 ? images : [{ src, alt }];

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={`block cursor-zoom-in ${className || ""}`} aria-label="Xem ảnh lớn">
        <Image src={src} alt={alt} fill className={imgClassName} sizes={sizes} priority={priority} />
      </button>
      {open && <Lightbox images={gallery} startIndex={index} onClose={() => setOpen(false)} />}
    </>
  );
}
