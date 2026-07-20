"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", content: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  async function loadComments() {
    setLoading(true);
    try {
      const { data } = await api.get(`/comments/post/${postId}`);
      setComments(data);
    } catch (e) {}
    setLoading(false);
  }
  useEffect(() => { loadComments(); }, [postId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      await api.post("/comments", { post: postId, ...form });
      setStatus("success");
      setForm({ name: "", email: "", content: "" });
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <div className="mt-16 pt-10 border-t border-on-background/10">
      <h2 className="font-heading text-2xl font-bold mb-8">Bình luận {comments.length > 0 && `(${comments.length})`}</h2>

      {loading ? (
        <p className="text-sm text-on-background/50">Đang tải bình luận...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-on-background/50 mb-8">Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ ý kiến!</p>
      ) : (
        <div className="space-y-6 mb-10">
          {comments.map((c) => (
            <div key={c._id} className="border border-on-background/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm">{c.name}</span>
                <span className="text-xs text-on-background/40">{new Date(c.createdAt).toLocaleDateString("vi-VN")}</span>
              </div>
              <p className="text-sm text-on-background/80 whitespace-pre-line">{c.content}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-surface rounded-xl p-6">
        <h3 className="font-heading font-semibold text-lg mb-4">Để lại bình luận</h3>
        {status === "success" ? (
          <p className="text-green-600 text-sm">Cảm ơn bạn! Bình luận của bạn đã được gửi và đang chờ duyệt.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                required
                placeholder="Họ và tên"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border border-on-background/20 rounded-lg px-4 py-2 text-sm bg-white"
              />
              <input
                type="email"
                placeholder="Email (không bắt buộc)"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="border border-on-background/20 rounded-lg px-4 py-2 text-sm bg-white"
              />
            </div>
            <textarea
              required
              rows={4}
              placeholder="Nội dung bình luận..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full border border-on-background/20 rounded-lg px-4 py-2 text-sm bg-white"
            />
            <button
              disabled={status === "sending"}
              className="btn-primary rounded-lg px-6 py-2.5 text-sm font-semibold disabled:opacity-50"
            >
              {status === "sending" ? "Đang gửi..." : "Gửi bình luận"}
            </button>
            {status === "error" && <p className="text-red-600 text-sm">Có lỗi xảy ra, vui lòng thử lại.</p>}
          </form>
        )}
      </div>
    </div>
  );
}
