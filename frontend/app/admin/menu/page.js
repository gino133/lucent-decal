"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function AdminMenuPage() {
  const [tab, setTab] = useState("main");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Menu điều hướng</h1>
      <p className="text-sm text-gray-500 mb-6">Quản lý các liên kết hiển thị trên thanh menu chính (đầu trang) và menu chân trang (footer) — giống quản lý Menu trong WordPress.</p>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab("main")} className={`px-4 py-2 rounded-full text-sm font-semibold ${tab === "main" ? "bg-black text-white" : "bg-white"}`}>
          Menu chính (đầu trang)
        </button>
        <button onClick={() => setTab("footer")} className={`px-4 py-2 rounded-full text-sm font-semibold ${tab === "footer" ? "bg-black text-white" : "bg-white"}`}>
          Menu chân trang (footer)
        </button>
      </div>

      {tab === "main" ? <MainMenuEditor /> : <FooterMenuEditor />}
    </div>
  );
}

// ---------- Menu chính: danh sách các mục, mỗi mục có thể có menu con (dropdown) ----------
function MainMenuEditor() {
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await api.get("/menu/main");
    setItems((data.items || []).sort((a, b) => a.order - b.order).map((it) => ({ ...it, children: it.children || [] })));
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function updateItem(idx, field, value) {
    const next = [...items];
    next[idx] = { ...next[idx], [field]: value };
    setItems(next);
  }
  function addItem() { setItems([...items, { label: "Trang mới", url: "/", order: items.length, children: [] }]); }
  function removeItem(idx) { setItems(items.filter((_, i) => i !== idx)); }
  function move(idx, dir) {
    const next = [...items];
    const swap = idx + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    next.forEach((it, i) => (it.order = i));
    setItems(next);
  }

  function updateChild(idx, cIdx, field, value) {
    const next = [...items];
    const children = [...next[idx].children];
    children[cIdx] = { ...children[cIdx], [field]: value };
    next[idx] = { ...next[idx], children };
    setItems(next);
  }
  function addChild(idx) {
    const next = [...items];
    next[idx] = { ...next[idx], children: [...next[idx].children, { label: "Mục con mới", url: "/" }] };
    setItems(next);
  }
  function removeChild(idx, cIdx) {
    const next = [...items];
    next[idx] = { ...next[idx], children: next[idx].children.filter((_, i) => i !== cIdx) };
    setItems(next);
  }
  function moveChild(idx, cIdx, dir) {
    const next = [...items];
    const children = [...next[idx].children];
    const swap = cIdx + dir;
    if (swap < 0 || swap >= children.length) return;
    [children[cIdx], children[swap]] = [children[swap], children[cIdx]];
    next[idx] = { ...next[idx], children };
    setItems(next);
  }

  async function save() {
    setSaving(true);
    await api.put("/menu/main", { items });
    setSaving(false);
    alert("Đã lưu menu chính!");
  }

  if (loading) return <p>Đang tải...</p>;

  return (
    <div className="max-w-3xl space-y-4">
      <p className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg p-3">
        Mỗi mục có thể thêm <strong>menu con</strong> — khi có menu con, mục đó sẽ hiện dạng dropdown (hổ trợ tối đa 2 cấp: mục cha → mục con).
      </p>

      {items.map((item, idx) => (
        <div key={idx} className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex flex-col">
              <button onClick={() => move(idx, -1)} className="text-gray-400 hover:text-black text-xs">▲</button>
              <button onClick={() => move(idx, 1)} className="text-gray-400 hover:text-black text-xs">▼</button>
            </div>
            <input value={item.label} onChange={(e) => updateItem(idx, "label", e.target.value)} placeholder="Tên hiển thị" className="flex-1 border rounded-lg px-3 py-2 text-sm" />
            <input value={item.url} onChange={(e) => updateItem(idx, "url", e.target.value)} placeholder="/duong-dan" className="flex-1 border rounded-lg px-3 py-2 text-sm" />
            <button onClick={() => removeItem(idx)} className="text-red-500 px-2">×</button>
          </div>

          <div className="pl-6 space-y-2">
            {item.children.map((child, cIdx) => (
              <div key={cIdx} className="flex items-center gap-2">
                <div className="flex flex-col">
                  <button onClick={() => moveChild(idx, cIdx, -1)} className="text-gray-300 hover:text-black text-[10px]">▲</button>
                  <button onClick={() => moveChild(idx, cIdx, 1)} className="text-gray-300 hover:text-black text-[10px]">▼</button>
                </div>
                <input
                  value={child.label}
                  onChange={(e) => updateChild(idx, cIdx, "label", e.target.value)}
                  placeholder="Tên mục con"
                  className="flex-1 border rounded-lg px-3 py-2 text-xs"
                />
                <input
                  value={child.url}
                  onChange={(e) => updateChild(idx, cIdx, "url", e.target.value)}
                  placeholder="/duong-dan"
                  className="flex-1 border rounded-lg px-3 py-2 text-xs"
                />
                <button onClick={() => removeChild(idx, cIdx)} className="text-red-500 px-2">×</button>
              </div>
            ))}
            <button onClick={() => addChild(idx)} className="text-xs text-blue-600 font-semibold">+ Thêm mục con</button>
          </div>
        </div>
      ))}

      <button onClick={addItem} className="text-sm text-blue-600 font-semibold">+ Thêm mục menu</button>

      <div className="pt-2">
        <button onClick={save} disabled={saving} className="bg-[#fae519] font-bold px-8 py-3 rounded-lg disabled:opacity-50">
          {saving ? "Đang lưu..." : "Lưu menu chính"}
        </button>
      </div>
    </div>
  );
}

// ---------- Menu chân trang: nhóm (label) chứa các liên kết con (children) ----------
function FooterMenuEditor() {
  const [groups, setGroups] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await api.get("/menu/footer");
    setGroups((data.items || []).sort((a, b) => a.order - b.order).map((g) => ({ ...g, children: g.children || [] })));
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function updateGroup(gIdx, field, value) {
    const next = [...groups];
    next[gIdx] = { ...next[gIdx], [field]: value };
    setGroups(next);
  }
  function addGroup() {
    setGroups([...groups, { label: "Nhóm mới", url: "#", order: groups.length, children: [] }]);
  }
  function removeGroup(gIdx) { setGroups(groups.filter((_, i) => i !== gIdx)); }
  function moveGroup(gIdx, dir) {
    const next = [...groups];
    const swap = gIdx + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[gIdx], next[swap]] = [next[swap], next[gIdx]];
    next.forEach((g, i) => (g.order = i));
    setGroups(next);
  }

  function updateChild(gIdx, cIdx, field, value) {
    const next = [...groups];
    const children = [...next[gIdx].children];
    children[cIdx] = { ...children[cIdx], [field]: value };
    next[gIdx] = { ...next[gIdx], children };
    setGroups(next);
  }
  function addChild(gIdx) {
    const next = [...groups];
    next[gIdx] = { ...next[gIdx], children: [...next[gIdx].children, { label: "Liên kết mới", url: "/" }] };
    setGroups(next);
  }
  function removeChild(gIdx, cIdx) {
    const next = [...groups];
    next[gIdx] = { ...next[gIdx], children: next[gIdx].children.filter((_, i) => i !== cIdx) };
    setGroups(next);
  }
  function moveChild(gIdx, cIdx, dir) {
    const next = [...groups];
    const children = [...next[gIdx].children];
    const swap = cIdx + dir;
    if (swap < 0 || swap >= children.length) return;
    [children[cIdx], children[swap]] = [children[swap], children[cIdx]];
    next[gIdx] = { ...next[gIdx], children };
    setGroups(next);
  }

  async function save() {
    setSaving(true);
    await api.put("/menu/footer", { items: groups });
    setSaving(false);
    alert("Đã lưu menu chân trang!");
  }

  if (loading) return <p>Đang tải...</p>;

  return (
    <div className="max-w-3xl space-y-4">
      <p className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg p-3">
        Menu chân trang gồm các <strong>nhóm</strong> (VD: "Khám phá", "Công ty"), mỗi nhóm chứa nhiều <strong>liên kết con</strong> hiển thị bên dưới tên nhóm.
      </p>

      {groups.map((group, gIdx) => (
        <div key={gIdx} className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex flex-col">
              <button onClick={() => moveGroup(gIdx, -1)} className="text-gray-400 hover:text-black text-xs">▲</button>
              <button onClick={() => moveGroup(gIdx, 1)} className="text-gray-400 hover:text-black text-xs">▼</button>
            </div>
            <input
              value={group.label}
              onChange={(e) => updateGroup(gIdx, "label", e.target.value)}
              placeholder="Tên nhóm (VD: Khám phá)"
              className="flex-1 border rounded-lg px-3 py-2 text-sm font-semibold"
            />
            <button onClick={() => removeGroup(gIdx)} className="text-red-500 text-sm font-semibold px-2">Xoá nhóm</button>
          </div>

          <div className="pl-6 space-y-2">
            {group.children.map((child, cIdx) => (
              <div key={cIdx} className="flex items-center gap-2">
                <div className="flex flex-col">
                  <button onClick={() => moveChild(gIdx, cIdx, -1)} className="text-gray-300 hover:text-black text-[10px]">▲</button>
                  <button onClick={() => moveChild(gIdx, cIdx, 1)} className="text-gray-300 hover:text-black text-[10px]">▼</button>
                </div>
                <input
                  value={child.label}
                  onChange={(e) => updateChild(gIdx, cIdx, "label", e.target.value)}
                  placeholder="Tên liên kết"
                  className="flex-1 border rounded-lg px-3 py-2 text-xs"
                />
                <input
                  value={child.url}
                  onChange={(e) => updateChild(gIdx, cIdx, "url", e.target.value)}
                  placeholder="/duong-dan"
                  className="flex-1 border rounded-lg px-3 py-2 text-xs"
                />
                <button onClick={() => removeChild(gIdx, cIdx)} className="text-red-500 px-2">×</button>
              </div>
            ))}
            <button onClick={() => addChild(gIdx)} className="text-xs text-blue-600 font-semibold">+ Thêm liên kết trong nhóm này</button>
          </div>
        </div>
      ))}

      <button onClick={addGroup} className="text-sm text-blue-600 font-semibold">+ Thêm nhóm mới</button>

      <div className="pt-2">
        <button onClick={save} disabled={saving} className="bg-[#fae519] font-bold px-8 py-3 rounded-lg disabled:opacity-50">
          {saving ? "Đang lưu..." : "Lưu menu chân trang"}
        </button>
      </div>
    </div>
  );
}
