"use client";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { apiWithRetry, friendlyErrorMessage } from "@/lib/api";
import { compressImage } from "@/lib/imageCompress";

const PREVIEW_SIZE = 200;
const POPOVER_WIDTH = 224; // tương ứng w-56
const POPOVER_EST_HEIGHT = 300; // ước lượng chiều cao tối đa, đủ để tính né mép màn hình

// ô ảnh nhỏ gọn cho từng dòng biến thể trong bảng — bấm vào mở bảng chọn nhanh từ
// các ảnh đã thêm ở mục "Hình ảnh" phía trên (không cần tải lại ảnh trùng cho từng
// biến thể), vẫn giữ lựa chọn tải ảnh riêng khác nếu biến thể đó cần ảnh chưa có sẵn.
//
// Cả bảng chọn (popover) lẫn ảnh xem trước lớn đều render qua Portal thẳng ra ngoài
// <body>, định vị bằng toạ độ thật (fixed) tính từ nút bấm — không phụ thuộc DOM cha,
// nên không bao giờ bị bảng/thẻ khung có overflow-hidden cắt mất, dù dòng đó nằm ở đầu,
// giữa hay cuối trang. Cả 2 đều tự "né" mép phải/dưới màn hình khi không đủ chỗ.
export default function VariantImageCell({ value, onChange, productImages = [] }) {
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const [popoverPos, setPopoverPos] = useState(null);
  const [hoverImg, setHoverImg] = useState(null);
  const [hoverPos, setHoverPos] = useState(null);
  const triggerRef = useRef(null);

  function togglePopover() {
    if (open) {
      closeAll();
      return;
    }
    const rect = triggerRef.current.getBoundingClientRect();
    const gap = 6;

    let left = rect.left;
    if (left + POPOVER_WIDTH > window.innerWidth) left = window.innerWidth - POPOVER_WIDTH - gap;
    if (left < gap) left = gap;

    // mặc định mở xuống dưới nút bấm; nếu không đủ chỗ (dòng cuối bảng, cuối trang) thì
    // tự chuyển sang mở lên trên nút bấm thay vì bị cắt mất phần dưới
    let top = rect.bottom + gap;
    if (top + POPOVER_EST_HEIGHT > window.innerHeight) {
      top = rect.top - POPOVER_EST_HEIGHT - gap;
      if (top < gap) top = gap;
    }

    setPopoverPos({ top, left });
    setOpen(true);
  }

  function closeAll() {
    setOpen(false);
    setHoverImg(null);
    setHoverPos(null);
  }

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
      closeAll();
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
        ref={triggerRef}
        type="button"
        onClick={togglePopover}
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

      {open && popoverPos && typeof document !== "undefined" && createPortal(
        <>
          <div className="fixed inset-0 z-[95]" onClick={closeAll} />
          <div
            className="fixed z-[96] w-56 bg-white border border-gray-200 rounded-lg shadow-xl p-3"
            style={{ top: popoverPos.top, left: popoverPos.left }}
          >
            {productImages.length > 0 ? (
              <>
                <p className="text-xs font-semibold text-gray-500 mb-2">Chọn từ ảnh sản phẩm ở trên</p>
                <div className="grid grid-cols-4 gap-1.5 mb-3 max-h-40 overflow-y-auto">
                  {productImages.map((img) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => { onChange(img); closeAll(); }}
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
        </>,
        document.body
      )}

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
