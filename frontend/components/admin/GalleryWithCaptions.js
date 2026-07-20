"use client";
import { useState } from "react";
import Image from "next/image";
import MediaLibraryModal from "./MediaLibraryModal";

// thư viện ảnh có chú thích riêng cho từng tấm — thêm ảnh qua thư viện chung (tải mới hoặc dùng lại ảnh cũ đều được)
export default function GalleryWithCaptions({ images, onChange }) {
  const [libraryOpen, setLibraryOpen] = useState(false);
  // ảnh cũ lưu dạng chuỗi (chưa có chú thích) vẫn hiển thị bình thường, chỉ là chưa có caption
  const normalized = (images || []).map((img) => (typeof img === "string" ? { url: img, caption: "" } : img));

  function updateCaption(i, caption) {
    const next = [...normalized];
    next[i] = { ...next[i], caption };
    onChange(next);
  }
  function remove(i) {
    onChange(normalized.filter((_, idx) => idx !== i));
  }
  function addUrls(urls) {
    onChange([...normalized, ...urls.map((url) => ({ url, caption: "" }))]);
  }

  return (
    <div>
      <div className="space-y-3 mb-3">
        {normalized.map((img, i) => (
          <div key={i} className="flex gap-3 items-start bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="relative w-20 h-20 rounded overflow-hidden bg-gray-100 shrink-0">
              {img.url && <Image src={img.url} alt="" fill className="object-cover" />}
            </div>
            <input
              placeholder="Chú thích ảnh (không bắt buộc)"
              value={img.caption || ""}
              onChange={(e) => updateCaption(i, e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
            />
            <button type="button" onClick={() => remove(i)} className="text-red-500 px-2 py-2">×</button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => setLibraryOpen(true)} className="text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg">
        + Thêm ảnh
      </button>
      {libraryOpen && <MediaLibraryModal multiple onClose={() => setLibraryOpen(false)} onSelect={addUrls} />}
    </div>
  );
}
