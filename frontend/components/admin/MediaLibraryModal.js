"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { api, apiWithRetry, friendlyErrorMessage } from "@/lib/api";
import { compressImage } from "@/lib/imageCompress";

// khung chọn ảnh: xem lại ảnh đã tải lên trước đó để dùng lại, hoặc tải ảnh mới lên luôn tại đây.
// dùng: <MediaLibraryModal onSelect={(url) => ...} onClose={() => ...} />
export default function MediaLibraryModal({ onSelect, onClose, multiple = false }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [picked, setPicked] = useState([]); // dùng khi multiple=true
  const [deletingId, setDeletingId] = useState(null);
  const [usagePanel, setUsagePanel] = useState(null); // { media, loading, usages }

  async function load(q = "") {
    setLoading(true);
    try {
      const { data } = await api.get(`/media?limit=60${q ? `&search=${encodeURIComponent(q)}` : ""}`);
      setItems(data.items || []);
    } catch (err) {
      alert("Không tải được thư viện ảnh: " + friendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  function handleSearch(e) {
    e.preventDefault();
    load(search);
  }

  async function handleUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const compressed = await Promise.all(files.map(compressImage));
      const formData = new FormData();
      compressed.forEach((f) => formData.append("images", f));
      const { data } = await apiWithRetry("post", "/upload/multiple", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const urls = data.files.map((f) => f.url);
      if (multiple) {
        onSelect(urls);
        onClose();
      } else {
        onSelect(urls[0]);
        onClose();
      }
    } catch (err) {
      alert("Tải ảnh lên thất bại: " + friendlyErrorMessage(err));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function handlePick(url) {
    if (!multiple) {
      onSelect(url);
      onClose();
      return;
    }
    setPicked((prev) => (prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]));
  }

  function confirmMultiple() {
    onSelect(picked);
    onClose();
  }

  // bấm nút xoá: kiểm tra trước xem ảnh đang được dùng ở đâu (sản phẩm/bài viết/dự
  // án/trang/cài đặt), rồi hiện bảng cảnh báo rõ ràng thay vì hỏi xác nhận suông
  async function handleDeleteClick(m, e) {
    e.stopPropagation();
    setUsagePanel({ media: m, loading: true, usages: [] });
    try {
      const { data } = await api.get(`/media/${m._id}/usage`);
      setUsagePanel({ media: m, loading: false, usages: data.usages || [] });
    } catch (err) {
      alert("Không kiểm tra được nơi đang sử dụng ảnh: " + friendlyErrorMessage(err));
      setUsagePanel(null);
    }
  }

  async function confirmDelete() {
    if (!usagePanel) return;
    const m = usagePanel.media;
    setUsagePanel(null);
    setDeletingId(m._id);
    try {
      await api.delete(`/media/${m._id}`);
      setItems((prev) => prev.filter((it) => it._id !== m._id));
      setPicked((prev) => prev.filter((u) => u !== m.url));
    } catch (err) {
      alert("Xoá ảnh thất bại: " + friendlyErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="fixed inset-0 z-[90] bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-3xl h-[80vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
          <h2 className="font-bold">Thư viện ảnh</h2>
          <button onClick={onClose} className="text-gray-500"><span className="material-symbols-outlined">close</span></button>
        </div>

        <div className="flex items-center gap-3 px-5 py-3 border-b shrink-0">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên file..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
            />
          </form>
          <label className="text-sm bg-[#fae519] font-semibold px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap">
            {uploading ? "Đang tải lên..." : "+ Tải ảnh mới"}
            <input type="file" accept="image/*" multiple={multiple} className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <p className="text-sm text-gray-400 text-center py-10">Đang tải...</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">Chưa có ảnh nào trong thư viện. Tải ảnh mới ở nút bên trên.</p>
          ) : (
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
              {items.map((m) => (
                <div key={m._id} className="group relative">
                  <button
                    type="button"
                    onClick={() => handlePick(m.url)}
                    className={`relative w-full aspect-square rounded-lg overflow-hidden border-2 ${picked.includes(m.url) ? "border-secondary" : "border-transparent hover:border-gray-300"}`}
                  >
                    <Image src={m.url} alt={m.filename || ""} fill className="object-cover" sizes="150px" />
                    {picked.includes(m.url) && (
                      <span className="absolute top-1 right-1 bg-secondary text-on-background rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">✓</span>
                    )}
                    {deletingId === m._id && (
                      <span className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <span className="material-symbols-outlined animate-spin text-gray-500">progress_activity</span>
                      </span>
                    )}
                  </button>
                  {/* nút xoá chỉ hiện khi rê chuột vào, tránh bấm nhầm khi chỉ muốn chọn ảnh */}
                  <button
                    type="button"
                    onClick={(e) => handleDeleteClick(m, e)}
                    title="Xoá ảnh này khỏi thư viện"
                    className="absolute top-1 left-1 w-6 h-6 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {multiple && (
          <div className="px-5 py-3 border-t shrink-0 flex justify-end">
            <button
              onClick={confirmMultiple}
              disabled={picked.length === 0}
              className="bg-[#fae519] font-semibold px-5 py-2 rounded-lg text-sm disabled:opacity-50"
            >
              Dùng {picked.length || ""} ảnh đã chọn
            </button>
          </div>
        )}
      </div>

      {/* bảng cảnh báo trước khi xoá: liệt kê rõ ảnh đang được dùng ở đâu (nếu có), kèm
          link mở sang đúng chỗ đó để kiểm tra/thay ảnh khác trước khi xoá thật sự */}
      {usagePanel && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4" onClick={() => setUsagePanel(null)}>
          <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b shrink-0">
              <h3 className="font-bold">Xoá ảnh "{usagePanel.media.filename || "này"}"?</h3>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {usagePanel.loading ? (
                <p className="text-sm text-gray-400">Đang kiểm tra ảnh có đang được dùng ở đâu không...</p>
              ) : usagePanel.usages.length === 0 ? (
                <p className="text-sm text-gray-600">
                  Ảnh này hiện chưa được dùng ở sản phẩm, bài viết, dự án, trang hay cài đặt nào — xoá an toàn.
                </p>
              ) : (
                <>
                  <p className="text-sm text-red-600 font-medium mb-3">
                    ⚠️ Ảnh đang được dùng ở {usagePanel.usages.length} chỗ dưới đây. Xoá sẽ làm mất ảnh ở những chỗ đó:
                  </p>
                  <ul className="space-y-2">
                    {usagePanel.usages.map((u, i) => (
                      <li key={i} className="flex items-center justify-between gap-3 text-sm border rounded-lg px-3 py-2">
                        <div className="min-w-0">
                          <span className="text-xs text-gray-400">{u.label}</span>
                          <p className="font-medium truncate">{u.name}</p>
                        </div>
                        <a
                          href={u.adminUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 underline shrink-0"
                        >
                          Mở sửa
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div className="px-5 py-3 border-t shrink-0 flex justify-end gap-2">
              <button onClick={() => setUsagePanel(null)} className="px-4 py-2 rounded-lg text-sm border border-gray-300 hover:bg-gray-50">
                Huỷ
              </button>
              <button
                onClick={confirmDelete}
                disabled={usagePanel.loading}
                className="px-4 py-2 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {usagePanel.usages.length > 0 ? "Vẫn xoá" : "Xoá ảnh"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
