"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import ImageUploader from "./ImageUploader";

export default function PostForm({ initial, postId }) {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(
    initial || {
      title: "", category: "", excerpt: "", content: "", coverImage: "",
      tags: [], author: "Lucent Glass", isFeatured: false, isPublished: true,
    }
  );
  const [tagInput, setTagInput] = useState((initial?.tags || []).join(", "));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/categories?type=post").then((res) => setCategories(res.data));
  }, []);

  function update(field, value) { setForm((f) => ({ ...f, [field]: value })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const tags = tagInput.split(",").map((t) => t.trim()).filter(Boolean);
      const payload = { ...form, tags, category: form.category?._id || form.category || undefined };
      if (postId) await api.put(`/posts/${postId}`, payload);
      else await api.post("/posts", payload);
      router.push("/admin/tin-tuc");
    } catch (err) {
      alert(err.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 space-y-6 max-w-3xl">
      <div>
        <label className="block text-sm font-semibold mb-2">Tiêu đề bài viết *</label>
        <input required value={form.title} onChange={(e) => update("title", e.target.value)} className="w-full border rounded-lg px-4 py-2" />
      </div>

      <div className="grid grid-cols-2 gap-4">
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
          <label className="block text-sm font-semibold mb-2">Tác giả</label>
          <input value={form.author} onChange={(e) => update("author", e.target.value)} className="w-full border rounded-lg px-4 py-2" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Mô tả ngắn (hiện ở danh sách)</label>
        <textarea rows={2} value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)} className="w-full border rounded-lg px-4 py-2" />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Ảnh đại diện</label>
        <ImageUploader value={form.coverImage} onChange={(v) => update("coverImage", v)} />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Nội dung bài viết (hỗ trợ HTML)</label>
        <textarea rows={10} value={form.content} onChange={(e) => update("content", e.target.value)} className="w-full border rounded-lg px-4 py-2 font-mono text-sm" />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Thẻ (tags, cách nhau bằng dấu phẩy)</label>
        <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="decal kính, xu hướng, thi công" className="w-full border rounded-lg px-4 py-2" />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFeatured} onChange={(e) => update("isFeatured", e.target.checked)} /> Bài viết nổi bật</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isPublished} onChange={(e) => update("isPublished", e.target.checked)} /> Đăng công khai</label>
      </div>

      <button disabled={saving} className="bg-[#fae519] font-bold px-8 py-3 rounded-lg disabled:opacity-50">
        {saving ? "Đang lưu..." : "Lưu bài viết"}
      </button>
    </form>
  );
}
