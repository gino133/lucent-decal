"use client";
import { useState } from "react";
import Image from "next/image";
import { api } from "@/lib/api";

// Component upload ảnh dùng chung: hỗ trợ 1 ảnh (single) hoặc nhiều ảnh (multiple)
export default function ImageUploader({ value, onChange, multiple = false }) {
  const [uploading, setUploading] = useState(false);
  const images = multiple ? (value || []) : value ? [value] : [];

  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      if (multiple) {
        const formData = new FormData();
        files.forEach((f) => formData.append("images", f));
        const { data } = await api.post("/upload/multiple", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        onChange([...(value || []), ...data.files.map((f) => f.url)]);
      } else {
        const formData = new FormData();
        formData.append("image", files[0]);
        const { data } = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        onChange(data.url);
      }
    } catch (err) {
      alert("Tải ảnh lên thất bại: " + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  }

  function removeImage(idx) {
    if (multiple) onChange((value || []).filter((_, i) => i !== idx));
    else onChange("");
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-3">
        {images.map((src, i) => (
          <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 group">
            <Image src={src} alt="" fill className="object-cover" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 bg-black/60 text-white w-5 h-5 rounded-full text-xs opacity-0 group-hover:opacity-100"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <label className="inline-block text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg cursor-pointer">
        {uploading ? "Đang tải lên..." : "+ Tải ảnh lên"}
        <input type="file" accept="image/*" multiple={multiple} className="hidden" onChange={handleFiles} disabled={uploading} />
      </label>
    </div>
  );
}
