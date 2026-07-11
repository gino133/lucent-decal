"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import ImageUploader from "@/components/admin/ImageUploader";

const TABS = [
  { key: "product", label: "Danh mục Sản phẩm" },
  { key: "project", label: "Danh mục Dự án" },
  { key: "post", label: "Danh mục Tin tức" },
];

export default function AdminCategoriesPage() {
  const [tab, setTab] = useState("product");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", imageUrl: "", order: 0 });
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await api.get(`/categories?type=${tab}`);
    setCategories(data.sort((a, b) => a.order - b.order));
    setLoading(false);
  }
  useEffect(() => { load(); resetForm(); }, [tab]);

  function resetForm() {
    setEditingId(null);
    setForm({ name: "", slug: "", description: "", imageUrl: "", order: categories.length });
  }

  function startEdit(cat) {
    setEditingId(cat._id);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || "", imageUrl: cat.imageUrl || "", order: cat.order || 0 });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, form);
      } else {
        await api.post("/categories", { ...form, type: tab });
      }
      resetForm();
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Xoá danh mục này? Các sản phẩm/dự án thuộc danh mục sẽ không bị xoá nhưng sẽ mất liên kết danh mục.")) return;
    await api.delete(`/categories/${id}`);
    if (editingId === id) resetForm();
    load();
  }

  const listPathByType = { product: "/admin/san-pham", project: "/admin/du-an", post: "/admin/tin-tuc" };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Danh mục</h1>
      <p className="text-sm text-gray-500 mb-6">
        Quản lý danh mục dùng để phân loại và lọc trên trang <strong>Sản phẩm</strong> và <strong>Dự án</strong> ngoài website.
      </p>

      <div className="flex gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-full text-sm font-semibold ${tab === t.key ? "bg-black text-white" : "bg-white"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {loading && <p className="text-gray-400">Đang tải...</p>}
          {!loading && categories.length === 0 && <p className="text-gray-400">Chưa có danh mục nào.</p>}

          {/* Desktop/tablet ngang: dạng bảng */}
          <div className="hidden md:block bg-white rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-4">Ảnh</th>
                  <th className="p-4">Tên danh mục</th>
                  <th className="p-4">Đường dẫn (slug)</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c._id} className="border-t border-gray-100">
                    <td className="p-4">
                      <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-100">
                        {c.imageUrl && <img src={c.imageUrl} alt="" className="w-full h-full object-cover" />}
                      </div>
                    </td>
                    <td className="p-4 font-medium">{c.name}</td>
                    <td className="p-4 text-gray-500">
                      <Link href={`${listPathByType[tab]}?category=${c.slug}`} className="hover:underline" title="Xem danh sách thuộc danh mục này trong admin">
                        /{c.slug}
                      </Link>
                    </td>
                    <td className="p-4 text-right space-x-3 whitespace-nowrap">
                      <button onClick={() => startEdit(c)} className="text-blue-600 font-semibold">Sửa</button>
                      <button onClick={() => handleDelete(c._id)} className="text-red-500 font-semibold">Xoá</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile/tablet đứng: dạng thẻ */}
          <div className="md:hidden space-y-3">
            {categories.map((c) => (
              <div key={c._id} className="bg-white rounded-xl p-4">
                <div className="flex gap-3 items-center">
                  <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-100 shrink-0">
                    {c.imageUrl && <img src={c.imageUrl} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{c.name}</p>
                    <Link href={`${listPathByType[tab]}?category=${c.slug}`} className="text-xs text-gray-500 hover:underline">/{c.slug}</Link>
                  </div>
                </div>
                <div className="flex gap-5 mt-3 pt-3 border-t border-gray-100 text-sm">
                  <button onClick={() => startEdit(c)} className="text-blue-600 font-semibold">Sửa</button>
                  <button onClick={() => handleDelete(c._id)} className="text-red-500 font-semibold">Xoá</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 space-y-4 self-start">
          <h2 className="font-bold">{editingId ? "Sửa danh mục" : "Thêm danh mục mới"}</h2>
          <div>
            <label className="block text-xs font-semibold mb-1">Tên danh mục *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Đường dẫn (slug)</label>
            <input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="Để trống sẽ tự tạo từ tên"
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Mô tả</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Ảnh minh hoạ</label>
            <ImageUploader value={form.imageUrl} onChange={(v) => setForm({ ...form, imageUrl: v })} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Thứ tự hiển thị</label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="flex gap-3">
            <button disabled={saving} className="bg-[#fae519] font-bold px-6 py-2 rounded-lg text-sm disabled:opacity-50">
              {saving ? "Đang lưu..." : editingId ? "Cập nhật" : "Thêm mới"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="text-sm text-gray-500 font-semibold">
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
