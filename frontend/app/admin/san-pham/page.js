"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";

const SORT_LABELS = {
  newest: "Mới nhất", oldest: "Cũ nhất",
  price_desc: "Giá: cao → thấp", price_asc: "Giá: thấp → cao",
  name_asc: "Tên: A → Z",
};

const DEFAULT_FILTERS = { search: "", category: "", visibility: "", minPrice: "", maxPrice: "", sort: "newest" };

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  async function load() {
    setLoading(true);
    const { data } = await api.get("/products/admin/all");
    setProducts(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
    api.get("/categories?type=product").then((res) => setCategories(res.data));
  }, []);

  async function handleDelete(id) {
    if (!confirm("Xoá sản phẩm này?")) return;
    await api.delete(`/products/${id}`);
    load();
  }

  function updateFilter(key, value) {
    setFilters((f) => ({ ...f, [key]: value }));
  }

  function resetFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  const hasActiveFilters =
    filters.search || filters.category || filters.visibility || filters.minPrice || filters.maxPrice || filters.sort !== "newest";

  // lọc + sắp xếp ngay trên trình duyệt — danh sách sản phẩm admin không quá nhiều
  // nên không cần thêm query lên backend, đổi bộ lọc là thấy kết quả ngay lập tức
  const filtered = useMemo(() => {
    let list = [...products];

    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter((p) => p.name?.toLowerCase().includes(q));
    }
    if (filters.category) list = list.filter((p) => p.category?._id === filters.category);
    if (filters.visibility === "shown") list = list.filter((p) => p.isPublished);
    if (filters.visibility === "hidden") list = list.filter((p) => !p.isPublished);
    if (filters.minPrice) list = list.filter((p) => (p.price || 0) >= Number(filters.minPrice));
    if (filters.maxPrice) list = list.filter((p) => (p.price || 0) <= Number(filters.maxPrice));

    switch (filters.sort) {
      case "oldest": list.reverse(); break; // API vốn trả về mới nhất trước, đảo lại là cũ nhất trước
      case "price_desc": list.sort((a, b) => (b.price || 0) - (a.price || 0)); break;
      case "price_asc": list.sort((a, b) => (a.price || 0) - (b.price || 0)); break;
      case "name_asc": list.sort((a, b) => (a.name || "").localeCompare(b.name || "", "vi")); break;
      default: break; // "newest" giữ nguyên thứ tự API trả về
    }
    return list;
  }, [products, filters]);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold">Sản phẩm ({filtered.length}{filtered.length !== products.length ? `/${products.length}` : ""})</h1>
        <div className="flex items-center gap-4">
          <Link href="/admin/danh-muc" className="text-sm text-blue-600 font-semibold hover:underline">Quản lý danh mục</Link>
          <Link href="/admin/san-pham/them-moi" className="bg-[#fae519] font-semibold px-5 py-2 rounded-lg whitespace-nowrap">+ Thêm sản phẩm</Link>
        </div>
      </div>

      {/* Bộ lọc + sắp xếp */}
      <div className="bg-white rounded-xl p-4 mb-6 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs text-gray-500 mb-1">Tìm theo tên sản phẩm</label>
          <input
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            placeholder="VD: Film vân gỗ..."
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Danh mục</label>
          <select value={filters.category} onChange={(e) => updateFilter("category", e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
            <option value="">Tất cả</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Hiển thị</label>
          <select value={filters.visibility} onChange={(e) => updateFilter("visibility", e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
            <option value="">Tất cả</option>
            <option value="shown">Đang hiển thị</option>
            <option value="hidden">Đang ẩn</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Giá từ</label>
          <input
            type="number" min="0" placeholder="0"
            value={filters.minPrice}
            onChange={(e) => updateFilter("minPrice", e.target.value)}
            className="w-28 border rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">đến</label>
          <input
            type="number" min="0" placeholder="Không giới hạn"
            value={filters.maxPrice}
            onChange={(e) => updateFilter("maxPrice", e.target.value)}
            className="w-32 border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Sắp xếp</label>
          <select value={filters.sort} onChange={(e) => updateFilter("sort", e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
            {Object.entries(SORT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>

        {hasActiveFilters && (
          <button onClick={resetFilters} className="text-xs text-gray-400 hover:text-gray-700 underline pb-2 whitespace-nowrap">
            Xoá bộ lọc
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-gray-400">Đang tải...</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-gray-400 bg-white rounded-xl p-6 text-center">Không có sản phẩm nào khớp bộ lọc hiện tại.</p>
      ) : (
        <>
          {/* Desktop/tablet ngang: dạng bảng */}
          <div className="hidden md:block bg-white rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-4">Ảnh</th>
                  <th className="p-4">Tên</th>
                  <th className="p-4">Danh mục</th>
                  <th className="p-4">Giá</th>
                  <th className="p-4">Hiển thị</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p._id} className="border-t border-gray-100">
                    <td className="p-4">
                      <div className="relative w-14 h-14 rounded overflow-hidden bg-gray-100">
                        {p.images?.[0] && <Image src={p.images[0]} alt="" fill className="object-cover" />}
                      </div>
                    </td>
                    <td className="p-4 font-medium">{p.name}</td>
                    <td className="p-4">{p.category?.name || "—"}</td>
                    <td className="p-4">{p.price?.toLocaleString("vi-VN")}đ</td>
                    <td className="p-4">{p.isPublished ? "✅" : "❌"}</td>
                    <td className="p-4 text-right space-x-3 whitespace-nowrap">
                      <Link href={`/admin/san-pham/${p._id}/edit`} className="text-blue-600 font-semibold">Sửa</Link>
                      <button onClick={() => handleDelete(p._id)} className="text-red-500 font-semibold">Xoá</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile/tablet đứng: dạng thẻ, luôn thấy rõ nút Sửa/Xoá */}
          <div className="md:hidden space-y-3">
            {filtered.map((p) => (
              <div key={p._id} className="bg-white rounded-xl p-4">
                <div className="flex gap-3">
                  <div className="relative w-16 h-16 rounded overflow-hidden bg-gray-100 shrink-0">
                    {p.images?.[0] && <Image src={p.images[0]} alt="" fill className="object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{p.name}</p>
                    <p className="text-xs text-gray-500 truncate">{p.category?.name || "—"}</p>
                    <p className="text-sm font-semibold mt-1">{p.price?.toLocaleString("vi-VN")}đ</p>
                  </div>
                  <span className="text-lg shrink-0">{p.isPublished ? "✅" : "❌"}</span>
                </div>
                <div className="flex gap-5 mt-3 pt-3 border-t border-gray-100 text-sm">
                  <Link href={`/admin/san-pham/${p._id}/edit`} className="text-blue-600 font-semibold">Sửa</Link>
                  <button onClick={() => handleDelete(p._id)} className="text-red-500 font-semibold">Xoá</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
