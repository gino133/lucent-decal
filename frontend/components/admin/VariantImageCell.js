"use client";
import { useState } from "react";
import Image from "next/image";
import { apiWithRetry, friendlyErrorMessage } from "@/lib/api";
import { compressImage } from "@/lib/imageCompress";

// ô ảnh nhỏ gọn cho từng dòng biến thể trong bảng — bấm vào để chọn/đổi ảnh, có ảnh thì hiện thumbnail
export default function VariantImageCell({ value, onChange }) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const compressed = await compressImage(file);
      const formData = new FormData();
      formData.append("image", compressed);
      const { data } = await apiWithRetry("post", "/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange(data.url);
    } catch (err) {
      alert("Tải ảnh lên thất bại: " + friendlyErrorMessage(err));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <label className="relative block w-10 h-10 rounded border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer overflow-hidden shrink-0" title="Ảnh riêng cho biến thể này (không bắt buộc)">
      {value ? (
        <Image src={value} alt="" fill className="object-cover" />
      ) : (
        <span className="flex items-center justify-center w-full h-full text-gray-400">
          <span className="material-symbols-outlined text-base">{uploading ? "hourglass_empty" : "add_a_photo"}</span>
        </span>
      )}
      {value && (
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); onChange(""); }}
          className="absolute -top-1 -right-1 bg-black/70 text-white w-4 h-4 rounded-full text-[10px] leading-4"
        >
          ×
        </button>
      )}
      <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
    </label>
  );
}
