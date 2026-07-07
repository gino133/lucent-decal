"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import BlockEditor from "@/components/admin/BlockEditor";

const PAGE_LABELS = {
  home: "Trang chủ", "gioi-thieu": "Giới thiệu",
  "ho-so-nang-luc": "Hồ sơ năng lực", "lien-he": "Liên hệ",
};

const BLOCK_TYPES = [
  "hero", "richtext", "imageText", "gallery", "stats", "cta",
  "logos", "productsFeatured", "projectsFeatured", "contactForm", "map",
];

export default function AdminPagesPage() {
  const [slugs] = useState(Object.keys(PAGE_LABELS));
  const [activeSlug, setActiveSlug] = useState("home");
  const [page, setPage] = useState(null);
  const [saving, setSaving] = useState(false);

  async function load(slug) {
    setPage(null);
    try {
      const { data } = await api.get(`/pages/admin/${slug}`);
      setPage(data || { slug, title: PAGE_LABELS[slug], blocks: [] });
    } catch {
      setPage({ slug, title: PAGE_LABELS[slug], blocks: [] });
    }
  }
  useEffect(() => { load(activeSlug); }, [activeSlug]);

  function updateBlock(idx, block) {
    const blocks = [...page.blocks];
    blocks[idx] = block;
    setPage({ ...page, blocks });
  }
  function removeBlock(idx) { setPage({ ...page, blocks: page.blocks.filter((_, i) => i !== idx) }); }
  function addBlock(type) {
    setPage({ ...page, blocks: [...page.blocks, { type, order: page.blocks.length, data: {}, visible: true }] });
  }
  function move(idx, dir) {
    const blocks = [...page.blocks];
    const swap = idx + dir;
    if (swap < 0 || swap >= blocks.length) return;
    [blocks[idx], blocks[swap]] = [blocks[swap], blocks[idx]];
    blocks.forEach((b, i) => (b.order = i));
    setPage({ ...page, blocks });
  }

  async function save() {
    setSaving(true);
    await api.put(`/pages/${activeSlug}`, page);
    setSaving(false);
    alert("Đã lưu nội dung trang!");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Nội dung trang</h1>
      <p className="text-sm text-gray-500 mb-6">Chỉnh sửa từng khối nội dung như xây trang bằng Gutenberg/Elementor của WordPress.</p>

      <div className="flex gap-2 mb-6">
        {slugs.map((s) => (
          <button key={s} onClick={() => setActiveSlug(s)} className={`px-4 py-2 rounded-full text-sm font-semibold ${activeSlug === s ? "bg-black text-white" : "bg-white"}`}>
            {PAGE_LABELS[s]}
          </button>
        ))}
      </div>

      {!page ? <p>Đang tải...</p> : (
        <div className="max-w-3xl">
          {page.blocks.map((block, idx) => (
            <div key={block._id || idx} className="relative">
              <div className="absolute -left-8 top-5 flex flex-col text-gray-400">
                <button onClick={() => move(idx, -1)} className="hover:text-black text-xs">▲</button>
                <button onClick={() => move(idx, 1)} className="hover:text-black text-xs">▼</button>
              </div>
              <BlockEditor block={block} onChange={(b) => updateBlock(idx, b)} onRemove={() => removeBlock(idx)} />
            </div>
          ))}

          <div className="bg-white border-2 border-dashed rounded-xl p-5 mb-6">
            <p className="text-sm font-semibold mb-3">+ Thêm khối nội dung mới</p>
            <div className="flex flex-wrap gap-2">
              {BLOCK_TYPES.map((t) => (
                <button key={t} onClick={() => addBlock(t)} className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg">{t}</button>
              ))}
            </div>
          </div>

          <button onClick={save} disabled={saving} className="bg-[#fae519] font-bold px-10 py-3 rounded-lg disabled:opacity-50">
            {saving ? "Đang lưu..." : "Lưu nội dung trang"}
          </button>
        </div>
      )}
    </div>
  );
}
