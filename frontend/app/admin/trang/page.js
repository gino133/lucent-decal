"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api, apiWithRetry, friendlyErrorMessage } from "@/lib/api";
import BlockEditor, { BLOCK_TYPE_LABELS } from "@/components/admin/BlockEditor";
import PreviewRenderer from "@/components/PreviewRenderer";

// Các trang cố định luôn có link cứng ngoài website (không theo /<slug>)
const FIXED_PAGE_LABELS = {
  home: "Trang chủ", "gioi-thieu": "Giới thiệu",
  "ho-so-nang-luc": "Hồ sơ năng lực", "lien-he": "Liên hệ",
};

const BLOCK_TYPES = [
  "hero", "richtext", "imageText", "featureCards", "gallery", "stats", "cta",
  "logos", "productsFeatured", "projectsFeatured", "postsFeatured", "contactForm", "map",
];

const RESERVED_SLUGS = [
  "gioi-thieu", "san-pham", "du-an", "ho-so-nang-luc", "lien-he",
  "gio-hang", "checkout", "admin", "trang", "api",
];

export default function AdminPagesPageWrapper() {
  return (
    <Suspense fallback={<p>Đang tải...</p>}>
      <AdminPagesPage />
    </Suspense>
  );
}

function AdminPagesPage() {
  const searchParams = useSearchParams();
  const [allPages, setAllPages] = useState([]); // toàn bộ trang lấy thật từ database
  const [loadingList, setLoadingList] = useState(true);
  const [newSlug, setNewSlug] = useState("");
  const [newTitle, setNewTitle] = useState("");
  // Nếu được mở từ trang Menu kèm ?slug=...&title=..., mở thẳng đến đúng trang đó
  const initialSlug = searchParams.get("slug") || "home";
  const [activeSlug, setActiveSlug] = useState(initialSlug);
  // Lưu tạm tên các trang được mở qua liên kết nhưng chưa từng lưu (chưa có trong DB)
  const [pendingLabels, setPendingLabels] = useState(() => {
    const t = searchParams.get("title");
    return t && initialSlug !== "home" ? { [initialSlug]: t } : {};
  });
  const [page, setPage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  // Luôn tải lại danh sách trang THẬT từ server (không dùng state tạm client)
  // để sau khi F5 vẫn thấy đầy đủ các trang đã tạo, kể cả trang tuỳ chỉnh.
  async function loadPageList() {
    setLoadingList(true);
    try {
      const { data } = await api.get("/pages");
      setAllPages(data || []);
    } catch {
      setAllPages([]);
    } finally {
      setLoadingList(false);
    }
  }
  useEffect(() => { loadPageList(); }, []);

  async function load(slug) {
    setPage(null);
    try {
      const { data } = await api.get(`/pages/admin/${slug}`);
      setPage(data || { slug, title: allLabels(slug), blocks: [] });
    } catch {
      setPage({ slug, title: allLabels(slug), blocks: [] });
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
    try {
      await apiWithRetry("put", `/pages/${activeSlug}`, page);
      await loadPageList();
      alert("Đã lưu nội dung trang!");
    } catch (err) {
      alert("Lưu thất bại: " + friendlyErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  // Tạo trang mới: LƯU NGAY xuống database (không chỉ thêm tạm trên giao diện)
  // để đường dẫn /<slug> hoạt động ngay và trang xuất hiện lại sau khi F5.
  async function createCustomPage() {
    const slug = newSlug.trim()
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    if (!slug || !newTitle.trim()) return alert("Nhập đầy đủ tên và đường dẫn (slug) cho trang mới.");
    if (RESERVED_SLUGS.includes(slug)) return alert(`"${slug}" là đường dẫn hệ thống đã dùng, vui lòng chọn slug khác.`);
    if (allPages.some((p) => p.slug === slug) || FIXED_PAGE_LABELS[slug]) {
      return alert("Slug này đã tồn tại, vui lòng chọn slug khác.");
    }

    setCreating(true);
    try {
      await apiWithRetry("put", `/pages/${slug}`, {
        slug,
        title: newTitle.trim(),
        blocks: [{ type: "richtext", order: 0, data: { html: "<p>Nội dung mới...</p>" }, visible: true }],
      });
      await loadPageList();
      setActiveSlug(slug);
      setNewSlug("");
      setNewTitle("");
    } catch (err) {
      alert("Tạo trang thất bại: " + friendlyErrorMessage(err));
    } finally {
      setCreating(false);
    }
  }

  async function deletePage(slug) {
    if (FIXED_PAGE_LABELS[slug]) return alert("Không thể xoá trang mặc định của hệ thống.");
    if (!confirm(`Xoá hẳn trang "${allLabels(slug)}"? Đường dẫn /${slug} sẽ ngừng hoạt động.`)) return;
    await api.delete(`/pages/${slug}`);
    await loadPageList();
    if (activeSlug === slug) setActiveSlug("home");
  }

  const customPagesMap = Object.fromEntries(allPages.map((p) => [p.slug, p.title]));
  function allLabels(slug) {
    return FIXED_PAGE_LABELS[slug] || customPagesMap[slug] || pendingLabels[slug] || slug;
  }

  // Danh sách tab: các trang cố định luôn hiện trước, sau đó tới các trang tuỳ chỉnh
  // (loại các slug trùng với trang cố định để tránh hiện 2 lần).
  // Nếu đang mở 1 trang qua liên kết (chưa từng lưu), vẫn hiện tab của nó ngay.
  const customSlugs = allPages.map((p) => p.slug).filter((s) => !FIXED_PAGE_LABELS[s]);
  if (!FIXED_PAGE_LABELS[activeSlug] && !customSlugs.includes(activeSlug)) {
    customSlugs.push(activeSlug);
  }
  const tabSlugs = [...Object.keys(FIXED_PAGE_LABELS), ...customSlugs];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Nội dung trang</h1>
      <p className="text-sm text-gray-500 mb-6">Chỉnh sửa từng khối nội dung như xây trang bằng Gutenberg/Elementor của WordPress.</p>

      <div className="flex gap-2 mb-4 flex-wrap items-center">
        {loadingList && <span className="text-sm text-gray-400">Đang tải danh sách trang...</span>}
        {tabSlugs.map((s) => (
          <div key={s} className="relative group">
            <button
              onClick={() => setActiveSlug(s)}
              className={`px-4 py-2 rounded-full text-sm font-semibold ${activeSlug === s ? "bg-black text-white" : "bg-white"}`}
            >
              {allLabels(s)}
            </button>
            {!FIXED_PAGE_LABELS[s] && (
              <button
                onClick={() => deletePage(s)}
                title="Xoá trang này"
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] leading-4 opacity-0 group-hover:opacity-100"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-4 mb-6 flex flex-wrap items-end gap-2 max-w-3xl">
        <div>
          <label className="block text-xs font-semibold mb-1">Tên trang mới</label>
          <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="VD: Tuyển dụng" className="border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Đường dẫn (slug)</label>
          <input value={newSlug} onChange={(e) => setNewSlug(e.target.value)} placeholder="VD: tuyen-dung" className="border rounded-lg px-3 py-2 text-sm" />
        </div>
        <button onClick={createCustomPage} disabled={creating} className="text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg font-semibold disabled:opacity-50">
          {creating ? "Đang tạo..." : "+ Tạo trang mới"}
        </button>
        <p className="text-xs text-gray-400 w-full">
          Trang mới sẽ được lưu ngay và có đường dẫn <code>/{newSlug || "<slug>"}</code> ngoài website.
        </p>
      </div>

      {!page ? <p>Đang tải...</p> : (
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
          {/* Cột soạn thảo */}
          <div className="max-w-3xl lg:max-w-none">
            {activeSlug !== "home" &&
              activeSlug !== "gioi-thieu" &&
              activeSlug !== "ho-so-nang-luc" &&
              activeSlug !== "lien-he" && (
                <p className="text-xs text-blue-600 bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4">
                  Trang này hiển thị tại: <code>/{activeSlug}</code>
                </p>
              )}

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
                  <button key={t} onClick={() => addBlock(t)} className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg">{BLOCK_TYPE_LABELS[t] || t}</button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={save} disabled={saving} className="bg-[#fae519] font-bold px-10 py-3 rounded-lg disabled:opacity-50">
                {saving ? "Đang lưu..." : "Lưu nội dung trang"}
              </button>
              <button
                onClick={() => setShowMobilePreview(true)}
                className="lg:hidden bg-white border border-gray-300 font-semibold px-5 py-3 rounded-lg text-sm"
              >
                👁 Xem trước
              </button>
            </div>
          </div>

          {/* Cột xem trước trực tiếp — chỉ hiện song song trên màn hình rộng (lg+) */}
          <div className="hidden lg:block sticky top-6">
            <PreviewFrame page={page} />
          </div>
        </div>
      )}

      {/* Xem trước dạng lớp phủ toàn màn hình — dùng cho mobile/tablet */}
      {showMobilePreview && page && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowMobilePreview(false)}>
          <div className="bg-white rounded-xl w-full max-w-lg h-[85vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
              <span className="font-semibold text-sm">Xem trước</span>
              <button onClick={() => setShowMobilePreview(false)} className="text-gray-500"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="flex-1 overflow-y-auto bg-background">
              <PreviewRenderer blocks={page.blocks} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Khung mô phỏng trình duyệt bao quanh phần xem trước, giúp dễ phân biệt
// đây là "bản xem trước" chứ không phải phần điều khiển của trang quản trị.
function PreviewFrame({ page }) {
  return (
    <div className="border border-gray-300 rounded-xl overflow-hidden shadow-sm">
      <div className="bg-gray-100 border-b border-gray-300 px-4 py-2.5 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
        <span className="ml-3 text-xs text-gray-500 truncate">Xem trước — {page.title}</span>
      </div>
      <div className="bg-background max-h-[calc(100vh-140px)] overflow-y-auto">
        <PreviewRenderer blocks={page.blocks} />
      </div>
    </div>
  );
}
