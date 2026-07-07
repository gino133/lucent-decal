"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import ImageUploader from "./ImageUploader";

export default function ProductForm({ initial, productId }) {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(
    initial || {
      name: "", category: "", price: "", unit: "m²",
      shortDescription: "", description: "", images: [],
      specs: [], isNew: false, isFeatured: true, isPublished: true,
    }
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/categories?type=product").then((res) => setCategories(res.data));
  }, []);

  function update(field, value) { setForm((f) => ({ ...f, [field]: value })); }

  function updateSpec(idx, key, value) {
    const specs = [...form.specs];
    specs[idx] = { ...specs[idx], [key]: value };
    update("specs", specs);
  }
  function addSpec() { update("specs", [...form.specs, { label: "", value: "" }]); }
  function removeSpec(idx) { update("specs", form.specs.filter((_, i) => i !== idx)); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), category: form.category || undefined };
      if (productId) await api.put(`/products/${productId}`, payload);
      else await api.post("/products", payload);
      router.push("/admin/san-pham");
    } catch (err) {
      alert(err.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 space-y-6 max-w-3xl">
      <div>
        <label className="block text-sm font-semibold mb-2">Tên sản phẩm *</label>
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
          <label className="block text-sm font-semibold mb-2">Giá (VNĐ) *</label>
          <input required type="number" value={form.price} onChange={(e) => update("price", e.target.value)} className="w-full border rounded-lg px-4 py-2" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Đơn vị</label>
          <input value={form.unit} onChange={(e) => update("unit", e.target.value)} className="w-full border rounded-lg px-4 py-2" placeholder="m², cuộn..." />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Mô tả ngắn</label>
        <input value={form.shortDescription} onChange={(e) => update("shortDescription", e.target.value)} className="w-full border rounded-lg px-4 py-2" />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Mô tả chi tiết (hỗ trợ HTML)</label>
        <textarea rows={5} value={form.description} onChange={(e) => update("description", e.target.value)} className="w-full border rounded-lg px-4 py-2" />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Hình ảnh</label>
        <ImageUploader multiple value={form.images} onChange={(v) => update("images", v)} />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Thông số kỹ thuật</label>
        {form.specs.map((s, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input placeholder="Tên" value={s.label} onChange={(e) => updateSpec(i, "label", e.target.value)} className="flex-1 border rounded-lg px-3 py-2 text-sm" />
            <input placeholder="Giá trị" value={s.value} onChange={(e) => updateSpec(i, "value", e.target.value)} className="flex-1 border rounded-lg px-3 py-2 text-sm" />
            <button type="button" onClick={() => removeSpec(i)} className="text-red-500 px-2">×</button>
          </div>
        ))}
        <button type="button" onClick={addSpec} className="text-sm text-blue-600 font-semibold">+ Thêm thông số</button>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isNew} onChange={(e) => update("isNew", e.target.checked)} /> Sản phẩm mới</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFeatured} onChange={(e) => update("isFeatured", e.target.checked)} /> Nổi bật (hiện ở trang chủ)</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isPublished} onChange={(e) => update("isPublished", e.target.checked)} /> Hiển thị công khai</label>
      </div>

      <button disabled={saving} className="bg-[#fae519] font-bold px-8 py-3 rounded-lg disabled:opacity-50">
        {saving ? "Đang lưu..." : "Lưu sản phẩm"}
      </button>
    </form>
  );
}
