"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import ImageUploader from "./ImageUploader";
import RichTextEditor from "./RichTextEditor";

export default function ProjectForm({ initial, projectId }) {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(
    initial || {
      name: "", category: "", client: "", location: "", year: "",
      coverImage: "", images: [], shortDescription: "", description: "",
      beforeAfterImages: [], isFeatured: false, isPublished: true,
    }
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/categories?type=project").then((res) => setCategories(res.data));
  }, []);

  function update(field, value) { setForm((f) => ({ ...f, [field]: value })); }

  function updateBA(idx, field, value) {
    const next = [...(form.beforeAfterImages || [])];
    next[idx] = { ...next[idx], [field]: value };
    update("beforeAfterImages", next);
  }
  function addBA() {
    update("beforeAfterImages", [...(form.beforeAfterImages || []), { before: "", after: "", caption: "" }]);
  }
  function removeBA(idx) {
    update("beforeAfterImages", (form.beforeAfterImages || []).filter((_, i) => i !== idx));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        category: form.category?._id || form.category || undefined,
        // Bỏ qua các cặp ảnh Trước/Sau chưa nhập đủ 2 ảnh, tránh lỗi hiển thị ngoài site
        beforeAfterImages: (form.beforeAfterImages || []).filter((p) => p.before && p.after),
      };
      if (projectId) await api.put(`/projects/${projectId}`, payload);
      else await api.post("/projects", payload);
      router.push("/admin/du-an");
    } catch (err) {
      alert(err.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 space-y-6 max-w-3xl">
      <div>
        <label className="block text-sm font-semibold mb-2">Tên dự án *</label>
        <input required value={form.name} onChange={(e) => update("name", e.target.value)} className="w-full border rounded-lg px-4 py-2" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold">Danh mục</label>
            <Link href="/admin/danh-muc" target="_blank" className="text-xs text-blue-600 font-semibold hover:underline">
              + Quản lý danh mục
            </Link>
          </div>
          <select value={form.category?._id || form.category || ""} onChange={(e) => update("category", e.target.value)} className="w-full border rounded-lg px-4 py-2">
            <option value="">-- Chọn --</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Khách hàng</label>
          <input value={form.client} onChange={(e) => update("client", e.target.value)} className="w-full border rounded-lg px-4 py-2" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Năm</label>
          <input value={form.year} onChange={(e) => update("year", e.target.value)} className="w-full border rounded-lg px-4 py-2" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Địa điểm</label>
        <input value={form.location} onChange={(e) => update("location", e.target.value)} className="w-full border rounded-lg px-4 py-2" />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Ảnh đại diện (cover)</label>
        <ImageUploader value={form.coverImage} onChange={(v) => update("coverImage", v)} />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Thư viện ảnh dự án</label>
        <ImageUploader multiple value={form.images} onChange={(v) => update("images", v)} />
      </div>

      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-semibold">Ảnh so sánh Trước / Sau</label>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Khách xem sẽ kéo được thanh trượt để so sánh trực quan. Có thể thêm nhiều cặp (VD: từng phòng/khu vực khác nhau).
        </p>

        {(form.beforeAfterImages || []).map((pair, idx) => (
          <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-semibold text-gray-500">Cặp ảnh #{idx + 1}</span>
              <button type="button" onClick={() => removeBA(idx)} className="text-red-500 text-xs font-semibold">Xoá cặp ảnh</button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-xs font-semibold mb-2">Ảnh TRƯỚC *</label>
                <ImageUploader value={pair.before} onChange={(v) => updateBA(idx, "before", v)} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-2">Ảnh SAU *</label>
                <ImageUploader value={pair.after} onChange={(v) => updateBA(idx, "after", v)} />
              </div>
            </div>
            <input
              placeholder="Chú thích (VD: Phòng khách - trước và sau khi dán decal)"
              value={pair.caption}
              onChange={(e) => updateBA(idx, "caption", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
        ))}
        <button type="button" onClick={addBA} className="text-sm text-blue-600 font-semibold">+ Thêm cặp ảnh Trước/Sau</button>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Mô tả ngắn</label>
        <input value={form.shortDescription} onChange={(e) => update("shortDescription", e.target.value)} className="w-full border rounded-lg px-4 py-2" />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Mô tả chi tiết</label>
        <RichTextEditor value={form.description} onChange={(html) => update("description", html)} placeholder="Nhập mô tả chi tiết dự án..." />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFeatured} onChange={(e) => update("isFeatured", e.target.checked)} /> Nổi bật (hiện ở trang chủ)</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isPublished} onChange={(e) => update("isPublished", e.target.checked)} /> Hiển thị công khai</label>
      </div>

      <button disabled={saving} className="bg-[#fae519] font-bold px-8 py-3 rounded-lg disabled:opacity-50">
        {saving ? "Đang lưu..." : "Lưu dự án"}
      </button>
    </form>
  );
}
