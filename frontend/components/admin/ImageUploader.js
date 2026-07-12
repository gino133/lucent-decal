"use client";
import { useState } from "react";
import Image from "next/image";
import { apiWithRetry, friendlyErrorMessage } from "@/lib/api";

const MAX_DIMENSION = 1920; // px cạnh dài nhất — đủ nét cho web, giảm đáng kể dung lượng ảnh chụp điện thoại
const JPEG_QUALITY = 0.82;

// Nén/resize ảnh ngay trên trình duyệt trước khi tải lên — ảnh chụp điện thoại hiện đại
// thường 5-15MB, dễ khiến việc tải lên bị timeout/rớt mạng trên server cấu hình thấp.
// Giảm xuống còn vài trăm KB giúp tải lên nhanh và ổn định hơn nhiều.
function compressImage(file) {
  return new Promise((resolve) => {
    // Không nén GIF (mất hiệu ứng động) hoặc file đã nhỏ sẵn
    if (file.type === "image/gif" || file.size < 400 * 1024) return resolve(file);

    const img = new window.Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.onload = () => {
        let { width, height } = img;
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) return resolve(file); // giữ file gốc nếu nén không hiệu quả hơn
            resolve(new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" }));
          },
          "image/jpeg",
          JPEG_QUALITY
        );
      };
      img.onerror = () => resolve(file); // không đọc được ảnh (hiếm) -> vẫn thử tải file gốc lên
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

// Component upload ảnh dùng chung: hỗ trợ 1 ảnh (single) hoặc nhiều ảnh (multiple)
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
