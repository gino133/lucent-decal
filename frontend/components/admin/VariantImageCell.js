"use client";
import { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { apiWithRetry, friendlyErrorMessage } from "@/lib/api";
import { compressImage } from "@/lib/imageCompress";

const PREVIEW_SIZE = 200;

// ô ảnh nhỏ gọn cho từng dòng biến thể trong bảng — bấm vào mở bảng chọn nhanh từ
// các ảnh đã thêm ở mục "Hình ảnh" phía trên (không cần tải lại ảnh trùng cho từng
// biến thể), vẫn giữ lựa chọn tải ảnh riêng khác nếu biến thể đó cần ảnh chưa có sẵn.
export default function VariantImageCell({ value, onChange, productImages = [] }) {
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const [hoverImg, setHoverImg] = useState(null);
  const [hoverPos, setHoverPos] = useState(null);

  // tính vị trí ảnh xem trước dựa theo toạ độ thật của ô nhỏ trên màn hình, rồi tự
  // né mép phải/dưới nếu không đủ chỗ — tránh bị tràn ra ngoài viewport
  function showPreview(img, el) {
    const rect = el.getBoundingClientRect();
    const gap = 8;
    let left = rect.right + gap;
    if (left + PREVIEW_SIZE > window.innerWidth) left = rect.left - PREVIEW_SIZE - gap;
    let top = rect.top;
    if (top + PREVIEW_SIZE > window.innerHeight) top = window.innerHeight - PREVIEW_SIZE - gap;
    if (top < gap) top = gap;
    setHoverPos({ top, left });
    setHoverImg(img);
  }
  function hidePreview() {
    setHoverImg(null);
    setHoverPos(null);
  }

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
      setOpen(false);
    } catch (err) {
      alert("Tải ảnh lên thất bại: " + friendlyErrorMessage(err));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative block w-10 h-10 rounded border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 overflow-hidden shrink-0"
        title="Chọn ảnh cho biến thể này (không bắt buộc) — khách bấm vào tuỳ chọn này thì ảnh sản phẩm sẽ đổi theo"
      >
        {value ? (
          <Image src={value} alt="" fill className="object-cover" />
        ) : (
          <span className="flex items-center justify-center w-full h-full text-gray-400">
            <span className="material-symbols-outlined text-base">{uploading ? "hourglass_empty" : "add_a_photo"}</span>
          </span>
        )}
      </button>

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute -top-1 -right-1 bg-black/70 text-white w-4 h-4 rounded-full text-[10px] leading-4 z-10"
          title="Bỏ ảnh riêng của biến thể này"
        >
          ×
        </button>
      )}

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => { setOpen(false); hidePreview(); }} />
          <div className="absolute left-0 top-full mt-1 z-40 w-56 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
            {productImages.length > 0 ? (
              <>
                <p className="text-xs font-semibold text-gray-500 mb-2">Chọn từ ảnh sản phẩm ở trên</p>
                <div className="grid grid-cols-4 gap-1.5 mb-3 max-h-40 overflow-y-auto">
                  {productImages.map((img) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => { onChange(img); setOpen(false); hidePreview(); }}
                      onMouseEnter={(e) => showPreview(img, e.currentTarget)}
                      onMouseLeave={hidePreview}
                      onFocus={(e) => showPreview(img, e.currentTarget)}
                      onBlur={hidePreview}
                      className={`relative w-10 h-10 rounded overflow-hidden border-2 shrink-0 ${
                        value === img ? "border-secondary" : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-xs text-gray-400 mb-3">Chưa có ảnh nào trong mục "Hình ảnh" ở trên — thêm ảnh ở đó trước rồi quay lại đây chọn.</p>
            )}
            <label className="flex items-center justify-center gap-1.5 text-xs text-primary border border-dashed border-gray-300 rounded py-1.5 cursor-pointer hover:bg-gray-50">
              <span className="material-symbols-outlined text-sm">{uploading ? "hourglass_empty" : "upload"}</span>
              Tải ảnh riêng khác
              <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
            </label>
          </div>
        </>
      )}

      {/* ảnh xem trước cỡ lớn render thẳng ra ngoài body qua Portal, để không bị bảng/khung
          cha có overflow-hidden cắt mất — định vị bằng toạ độ thật (fixed), không phụ thuộc
          vào vị trí trong DOM nên luôn hiện đầy đủ dù ô nằm ở đâu trong bảng */}
      {hoverImg && hoverPos && typeof document !== "undefined" && createPortal(
        <div
          className="fixed rounded-lg overflow-hidden border border-gray-200 shadow-xl bg-white z-[999] pointer-events-none"
          style={{ top: hoverPos.top, left: hoverPos.left, width: PREVIEW_SIZE, height: PREVIEW_SIZE }}
        >
          <Image src={hoverImg} alt="Xem trước" fill className="object-cover" sizes={`${PREVIEW_SIZE}px`} />
        </div>,
        document.body
      )}
    </div>
  );
}
