"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState([]);

  async function load() {
    const { data } = await api.get("/contacts");
    setContacts(data);
  }
  useEffect(() => { load(); }, []);

  async function markReplied(id) {
    await api.put(`/contacts/${id}`, { status: "replied" });
    load();
  }
  async function remove(id) {
    if (!confirm("Xoá liên hệ này?")) return;
    await api.delete(`/contacts/${id}`);
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Yêu cầu liên hệ ({contacts.length})</h1>
      <div className="space-y-4">
        {contacts.map((c) => (
          <div key={c._id} className="bg-white rounded-xl p-6">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">{c.name} {c.status === "new" && <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Mới</span>}</p>
                <p className="text-sm text-gray-500">{c.phone} · {c.email}</p>
              </div>
              <span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString("vi-VN")}</span>
            </div>
            {c.subject && <p className="text-sm font-medium mt-3">{c.subject}</p>}
            <p className="text-sm mt-2 text-gray-700">{c.message}</p>
            <div className="mt-4 space-x-4 text-sm">
              {c.status === "new" && <button onClick={() => markReplied(c._id)} className="text-blue-600 font-semibold">Đánh dấu đã trả lời</button>}
              <button onClick={() => remove(c._id)} className="text-red-500 font-semibold">Xoá</button>
            </div>
          </div>
        ))}
        {contacts.length === 0 && <p className="text-gray-400">Chưa có yêu cầu liên hệ nào.</p>}
      </div>
    </div>
  );
}
