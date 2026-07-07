"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import ImageUploader from "./ImageUploader";

export default function ProjectForm({ initial, projectId }) {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(
    initial || {
      name: "", category: "", client: "", location: "", year: "",
      coverImage: "", images: [], shortDescription: "", description: "",
      isFeatured: false, isPublished: true,
    }
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/categories?type=project").then((res) => setCategories(res.data));
  }, []);

  function update(field, value) { setForm((f) => ({ ...f, [field]: value })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, category: form.category?._id || form.category || undefined };
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
          <label className="block text-sm font-semibold mb-2">Danh mục</label>
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

      <div>
        <label className="block text-sm font-semibold mb-2">Mô tả ngắn</label>
        <input value={form.shortDescription} onChange={(e) => update("shortDescription", e.target.value)} className="w-full border rounded-lg px-4 py-2" />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Mô tả chi tiết (hỗ trợ HTML)</label>
        <textarea rows={5} value={form.description} onChange={(e) => update("description", e.target.value)} className="w-full border rounded-lg px-4 py-2" />
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
