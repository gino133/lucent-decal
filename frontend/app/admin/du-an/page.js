"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await api.get("/projects/admin/all");
    setProjects(data);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function handleDelete(id) {
    if (!confirm("Xoá dự án này?")) return;
    await api.delete(`/projects/${id}`);
    load();
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-8">
        <h1 className="text-2xl font-bold">Dự án</h1>
        <div className="flex items-center gap-4">
          <Link href="/admin/danh-muc" className="text-sm text-blue-600 font-semibold hover:underline">Quản lý danh mục</Link>
          <Link href="/admin/du-an/them-moi" className="bg-[#fae519] font-semibold px-5 py-2 rounded-lg whitespace-nowrap">+ Thêm dự án</Link>
        </div>
      </div>

      {loading && <p className="text-gray-400">Đang tải...</p>}

      {/* Desktop/tablet ngang: dạng bảng */}
      <div className="hidden md:block bg-white rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr><th className="p-4">Ảnh</th><th className="p-4">Tên</th><th className="p-4">Khách hàng</th><th className="p-4">Năm</th><th className="p-4">Hiển thị</th><th className="p-4"></th></tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p._id} className="border-t border-gray-100">
                <td className="p-4"><div className="relative w-14 h-14 rounded overflow-hidden bg-gray-100">{p.coverImage && <Image src={p.coverImage} alt="" fill className="object-cover" />}</div></td>
                <td className="p-4 font-medium">{p.name}</td>
                <td className="p-4">{p.client}</td>
                <td className="p-4">{p.year}</td>
                <td className="p-4">{p.isPublished ? "✅" : "❌"}</td>
                <td className="p-4 text-right space-x-3 whitespace-nowrap">
                  <Link href={`/admin/du-an/${p._id}/edit`} className="text-blue-600 font-semibold">Sửa</Link>
                  <button onClick={() => handleDelete(p._id)} className="text-red-500 font-semibold">Xoá</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/tablet đứng: dạng thẻ */}
      <div className="md:hidden space-y-3">
        {projects.map((p) => (
          <div key={p._id} className="bg-white rounded-xl p-4">
            <div className="flex gap-3">
              <div className="relative w-16 h-16 rounded overflow-hidden bg-gray-100 shrink-0">
                {p.coverImage && <Image src={p.coverImage} alt="" fill className="object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{p.name}</p>
                <p className="text-xs text-gray-500 truncate">{p.client} {p.year && `· ${p.year}`}</p>
              </div>
              <span className="text-lg shrink-0">{p.isPublished ? "✅" : "❌"}</span>
            </div>
            <div className="flex gap-5 mt-3 pt-3 border-t border-gray-100 text-sm">
              <Link href={`/admin/du-an/${p._id}/edit`} className="text-blue-600 font-semibold">Sửa</Link>
              <button onClick={() => handleDelete(p._id)} className="text-red-500 font-semibold">Xoá</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
