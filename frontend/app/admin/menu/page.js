"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function AdminMenuPage() {
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data } = await api.get("/menu/main");
    setItems((data.items || []).sort((a, b) => a.order - b.order));
  }
  useEffect(() => { load(); }, []);

  function updateItem(idx, field, value) {
    const next = [...items];
    next[idx] = { ...next[idx], [field]: value };
    setItems(next);
  }
  function addItem() { setItems([...items, { label: "Trang mới", url: "/", order: items.length }]); }
  function removeItem(idx) { setItems(items.filter((_, i) => i !== idx)); }
  function move(idx, dir) {
    const next = [...items];
    const swap = idx + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    next.forEach((it, i) => (it.order = i));
    setItems(next);
  }

  async function save() {
    setSaving(true);
    await api.put("/menu/main", { items });
    setSaving(false);
    alert("Đã lưu menu!");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Menu điều hướng</h1>
      <p className="text-sm text-gray-500 mb-8">Thêm, sửa, xoá, sắp xếp thứ tự các mục trên thanh menu chính — giống quản lý Menu trong WordPress.</p>

      <div className="bg-white rounded-xl p-6 space-y-3 max-w-2xl">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="flex flex-col">
              <button onClick={() => move(idx, -1)} className="text-gray-400 hover:text-black text-xs">▲</button>
              <button onClick={() => move(idx, 1)} className="text-gray-400 hover:text-black text-xs">▼</button>
            </div>
            <input value={item.label} onChange={(e) => updateItem(idx, "label", e.target.value)} placeholder="Tên hiển thị" className="flex-1 border rounded-lg px-3 py-2 text-sm" />
            <input value={item.url} onChange={(e) => updateItem(idx, "url", e.target.value)} placeholder="/duong-dan" className="flex-1 border rounded-lg px-3 py-2 text-sm" />
            <button onClick={() => removeItem(idx)} className="text-red-500 px-2">×</button>
          </div>
        ))}
        <button onClick={addItem} className="text-sm text-blue-600 font-semibold">+ Thêm mục menu</button>

        <div className="pt-4">
          <button onClick={save} disabled={saving} className="bg-[#fae519] font-bold px-8 py-3 rounded-lg disabled:opacity-50">
            {saving ? "Đang lưu..." : "Lưu menu"}
          </button>
        </div>
      </div>
    </div>
  );
}
