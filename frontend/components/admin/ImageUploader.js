"use client";
import { useState } from "react";
import Image from "next/image";
import { apiWithRetry, friendlyErrorMessage } from "@/lib/api";
import { compressImage } from "@/lib/imageCompress";

// component upload ảnh dùng chung, 1 ảnh hoặc nhiều ảnh đều được
export default function ImageUploader({ value, onChange, multiple = false }) {
  const [uploading, setUploading] = useState(false);
  const [progressText, setProgressText] = useState("");
  const images = multiple ? (value || []) : value ? [value] : [];

  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      if (multiple) {
        setProgressText(`Đang nén ${files.length} ảnh...`);
        const compressed = await Promise.all(files.map(compressImage));
        setProgressText("Đang tải lên...");
        const formData = new FormData();
        compressed.forEach((f) => formData.append("images", f));
        const { data } = await apiWithRetry("post", "/upload/multiple", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        onChange([...(value || []), ...data.files.map((f) => f.url)]);
      } else {
        setProgressText("Đang nén ảnh...");
        const compressedFile = await compressImage(files[0]);
        setProgressText("Đang tải lên...");
        const formData = new FormData();
        formData.append("image", compressedFile);
        const { data } = await apiWithRetry("post", "/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        onChange(data.url);
      }
    } catch (err) {
      alert("Tải ảnh lên thất bại: " + friendlyErrorMessage(err));
    } finally {
      setUploading(false);
      setProgressText("");
      e.target.value = ""; // cho phép chọn lại đúng file đó lần nữa nếu vừa lỗi
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
        {uploading ? progressText || "Đang xử lý..." : "+ Tải ảnh lên"}
        <input type="file" accept="image/*" multiple={multiple} className="hidden" onChange={handleFiles} disabled={uploading} />
      </label>
    </div>
  );
}
