"use client";
import ImageUploader from "./ImageUploader";
import RichTextEditor from "./RichTextEditor";

const BLOCK_TYPE_LABELS = {
  hero: "Banner lớn (Hero)", richtext: "Đoạn văn bản", imageText: "Ảnh + Chữ",
  gallery: "Thư viện ảnh", stats: "Số liệu nổi bật", testimonial: "Đánh giá khách hàng",
  cta: "Kêu gọi hành động", team: "Đội ngũ", faq: "Câu hỏi thường gặp",
  logos: "Logo đối tác", productsFeatured: "Sản phẩm nổi bật (tự động)",
  projectsFeatured: "Dự án nổi bật (tự động)", postsFeatured: "Tin tức nổi bật (tự động)",
  contactForm: "Form liên hệ", map: "Bản đồ",
};

export default function BlockEditor({ block, onChange, onRemove }) {
  const data = block.data || {};
  function updateData(field, value) { onChange({ ...block, data: { ...data, [field]: value } }); }

  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-gray-50 mb-4">
      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold text-sm bg-black text-white px-3 py-1 rounded-full">
          {BLOCK_TYPE_LABELS[block.type] || block.type}
        </span>
        <div className="space-x-3">
          <label className="text-xs">
            <input type="checkbox" checked={block.visible !== false} onChange={(e) => onChange({ ...block, visible: e.target.checked })} /> Hiển thị
          </label>
          <button onClick={onRemove} className="text-red-500 text-xs font-semibold">Xoá khối</button>
        </div>
      </div>

      {block.type === "hero" && (
        <div className="space-y-3">
          <input placeholder="Tiêu đề" value={data.title || ""} onChange={(e) => updateData("title", e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Mô tả phụ" value={data.subtitle || ""} onChange={(e) => updateData("subtitle", e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Chữ nút bấm" value={data.ctaText || ""} onChange={(e) => updateData("ctaText", e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
            <input placeholder="Đường dẫn nút bấm" value={data.ctaLink || ""} onChange={(e) => updateData("ctaLink", e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
          </div>
          <ImageUploader value={data.image} onChange={(v) => updateData("image", v)} />
        </div>
      )}

      {block.type === "richtext" && (
        <RichTextEditor value={data.html} onChange={(html) => updateData("html", html)} placeholder="Nhập nội dung..." minHeight={220} />
      )}

      {block.type === "imageText" && (
        <div className="space-y-3">
          <input placeholder="Tiêu đề" value={data.title || ""} onChange={(e) => updateData("title", e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
          <RichTextEditor value={data.html} onChange={(html) => updateData("html", html)} placeholder="Nhập nội dung..." minHeight={160} />
          <select value={data.imagePosition || "left"} onChange={(e) => updateData("imagePosition", e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
            <option value="left">Ảnh bên trái</option>
            <option value="right">Ảnh bên phải</option>
          </select>
          <ImageUploader value={data.image} onChange={(v) => updateData("image", v)} />
        </div>
      )}

      {block.type === "gallery" && (
        <div className="space-y-3">
          <input placeholder="Tiêu đề" value={data.title || ""} onChange={(e) => updateData("title", e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
          <ImageUploader multiple value={data.images || []} onChange={(v) => updateData("images", v)} />
        </div>
      )}

      {block.type === "stats" && (
        <StatsEditor data={data} updateData={updateData} />
      )}

      {block.type === "cta" && (
        <div className="space-y-3">
          <input placeholder="Tiêu đề" value={data.title || ""} onChange={(e) => updateData("title", e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
          <textarea rows={2} placeholder="Mô tả" value={data.description || ""} onChange={(e) => updateData("description", e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Chữ nút bấm" value={data.ctaText || ""} onChange={(e) => updateData("ctaText", e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
            <input placeholder="Đường dẫn" value={data.ctaLink || ""} onChange={(e) => updateData("ctaLink", e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
      )}

      {block.type === "logos" && (
        <div className="space-y-3">
          <input placeholder="Tiêu đề" value={data.title || ""} onChange={(e) => updateData("title", e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
          <ImageUploader multiple value={data.logos || []} onChange={(v) => updateData("logos", v)} />
        </div>
      )}

      {block.type === "map" && (
        <input placeholder="URL nhúng Google Maps (embed)" value={data.embedUrl || ""} onChange={(e) => updateData("embedUrl", e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
      )}

      {(block.type === "productsFeatured" || block.type === "projectsFeatured" || block.type === "postsFeatured") && (
        <input placeholder="Tiêu đề khối" value={data.title || ""} onChange={(e) => updateData("title", e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
      )}

      {block.type === "contactForm" && <p className="text-xs text-gray-500">Khối này tự động hiển thị form liên hệ, không cần cấu hình thêm.</p>}
    </div>
  );
}

function StatsEditor({ data, updateData }) {
  const items = data.items || [];
  function updateItem(idx, field, value) {
    const next = [...items];
    next[idx] = { ...next[idx], [field]: value };
    updateData("items", next);
  }
  function add() { updateData("items", [...items, { number: "", label: "" }]); }
  function remove(idx) { updateData("items", items.filter((_, i) => i !== idx)); }

  return (
    <div className="space-y-3">
      <input placeholder="Tiêu đề khối" value={data.title || ""} onChange={(e) => updateData("title", e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
      {items.map((it, i) => (
        <div key={i} className="flex gap-2">
          <input placeholder="Số (vd: 500+)" value={it.number} onChange={(e) => updateItem(i, "number", e.target.value)} className="flex-1 border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Nhãn" value={it.label} onChange={(e) => updateItem(i, "label", e.target.value)} className="flex-1 border rounded-lg px-3 py-2 text-sm" />
          <button onClick={() => remove(i)} className="text-red-500 px-2">×</button>
        </div>
      ))}
      <button onClick={add} className="text-sm text-blue-600 font-semibold">+ Thêm số liệu</button>
    </div>
  );
}
