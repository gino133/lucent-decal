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
                <button
                  key={m._id}
                  type="button"
                  onClick={() => handlePick(m.url)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 ${picked.includes(m.url) ? "border-secondary" : "border-transparent hover:border-gray-300"}`}
                >
                  <Image src={m.url} alt={m.filename || ""} fill className="object-cover" sizes="150px" />
                  {picked.includes(m.url) && (
                    <span className="absolute top-1 right-1 bg-secondary text-on-background rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">✓</span>
                  )}
                </button>
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
    </div>
  );
}
