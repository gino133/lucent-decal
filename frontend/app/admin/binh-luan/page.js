"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

const STATUS_LABELS = { pending: "Chờ duyệt", approved: "Đã duyệt", rejected: "Đã từ chối" };
const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function AdminCommentsPage() {
  const [comments, setComments] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await api.get("/comments");
    setComments(data);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function updateStatus(id, status) {
    await api.put(`/comments/${id}`, { status });
    load();
  }
  async function remove(id) {
    if (!confirm("Xoá bình luận này?")) return;
    await api.delete(`/comments/${id}`);
    load();
  }

  const filtered = filter === "all" ? comments : comments.filter((c) => c.status === filter);
  const pendingCount = comments.filter((c) => c.status === "pending").length;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Bình luận</h1>
      <p className="text-sm text-gray-500 mb-6">
        Bình luận mới gửi sẽ ở trạng thái <strong>Chờ duyệt</strong> và chỉ hiển thị công khai sau khi bạn duyệt, giúp tránh spam.
      </p>

      <div className="flex gap-2 mb-6">
        {[
          { key: "pending", label: `Chờ duyệt${pendingCount ? ` (${pendingCount})` : ""}` },
          { key: "approved", label: "Đã duyệt" },
          { key: "rejected", label: "Đã từ chối" },
          { key: "all", label: "Tất cả" },
        ].map((t) => (
          <button key={t.key} onClick={() => setFilter(t.key)} className={`px-4 py-2 rounded-full text-sm font-semibold ${filter === t.key ? "bg-black text-white" : "bg-white"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? <p>Đang tải...</p> : (
        <div className="space-y-4">
          {filtered.length === 0 && <p className="text-gray-400">Không có bình luận nào.</p>}
          {filtered.map((c) => (
            <div key={c._id} className="bg-white rounded-xl p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-semibold">{c.name}</span>
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded ${STATUS_COLORS[c.status]}`}>{STATUS_LABELS[c.status]}</span>
                  {c.email && <p className="text-xs text-gray-400">{c.email}</p>}
                </div>
                <span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString("vi-VN")}</span>
              </div>
              <p className="text-sm text-gray-700 mb-2">{c.content}</p>
              {c.post?.slug && (
                <Link href={`/tin-tuc/${c.post.slug}`} target="_blank" className="text-xs text-blue-600 hover:underline">
                  Bài viết: {c.post.title}
                </Link>
              )}
              <div className="mt-4 space-x-4 text-sm">
                {c.status !== "approved" && <button onClick={() => updateStatus(c._id, "approved")} className="text-green-600 font-semibold">Duyệt</button>}
                {c.status !== "rejected" && <button onClick={() => updateStatus(c._id, "rejected")} className="text-orange-500 font-semibold">Từ chối</button>}
                <button onClick={() => remove(c._id)} className="text-red-500 font-semibold">Xoá</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
