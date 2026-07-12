"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import ImageUploader from "./ImageUploader";
import RichTextEditor from "./RichTextEditor";

// Tích Descartes (cartesian product): từ [["Trắng","Đen"], ["S","L"]]
// tạo ra tất cả tổ hợp: [["Trắng","S"],["Trắng","L"],["Đen","S"],["Đen","L"]]
function cartesianProduct(arrays) {
  return arrays.reduce((acc, curr) => acc.flatMap((a) => curr.map((c) => [...a, c])), [[]]);
}

export default function ProductForm({ initial, productId }) {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  // Sản phẩm tạo trước khi có tính năng biến thể sẽ không có optionTypes/variants
  // trong database — luôn đặt mặc định [] để tránh lỗi, và chuyển optionTypes
  // sang dạng { name, valuesText } (text) để hiển thị/sửa dễ dàng trên form.
  const [form, setForm] = useState(() => ({
    name: "", category: "", price: "", unit: "m²",
    shortDescription: "", description: "", images: [],
    specs: [], isNew: false, isFeatured: true, isPublished: true,
    ...initial,
    optionTypes: (initial?.optionTypes || []).map((opt) => ({
      name: opt.name || "",
      valuesText: (opt.values || []).join(", "),
    })),
    variants: initial?.variants || [],
  }));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/categories?type=product").then((res) => setCategories(res.data));
  }, []);

  function update(field, value) { setForm((f) => ({ ...f, [field]: value })); }

  function updateSpec(idx, key, value) {
    const specs = [...form.specs];
    specs[idx] = { ...specs[idx], [key]: value };
    update("specs", specs);
  }
  function addSpec() { update("specs", [...form.specs, { label: "", value: "" }]); }
  function removeSpec(idx) { update("specs", form.specs.filter((_, i) => i !== idx)); }

  // ---- Tuỳ chọn (Màu sắc / Kích thước / Đơn vị tính...) ----
  function updateOptionType(idx, field, value) {
    const next = [...form.optionTypes];
    next[idx] = { ...next[idx], [field]: value };
    update("optionTypes", next);
  }
  function addOptionType() {
    update("optionTypes", [...form.optionTypes, { name: "", valuesText: "" }]);
  }
  function removeOptionType(idx) {
    update("optionTypes", form.optionTypes.filter((_, i) => i !== idx));
  }

  // Sinh lại toàn bộ biến thể từ các loại tuỳ chọn hiện tại (tích Descartes),
  // giữ nguyên giá của các tổ hợp đã có, chỉ thêm giá mặc định cho tổ hợp mới.
  function regenerateVariants() {
    const valueLists = form.optionTypes
      .map((opt) => (opt.valuesText || "").split(",").map((v) => v.trim()).filter(Boolean))
      .filter((list) => list.length > 0);

    if (valueLists.length === 0) {
      alert("Nhập ít nhất 1 loại tuỳ chọn và giá trị (cách nhau bằng dấu phẩy) trước khi tạo biến thể.");
      return;
    }

    const combos = cartesianProduct(valueLists);
    const existingByKey = Object.fromEntries(
      (form.variants || []).map((v) => [v.optionValues.join(" / "), v])
    );

    const nextVariants = combos.map((combo) => {
      const key = combo.join(" / ");
      const existing = existingByKey[key];
      return existing || { optionValues: combo, price: Number(form.price) || 0, stock: 999, sku: "" };
    });

    update("variants", nextVariants);
  }

  function updateVariant(idx, field, value) {
    const next = [...form.variants];
    next[idx] = { ...next[idx], [field]: value };
    update("variants", next);
  }
  function removeVariant(idx) {
    update("variants", form.variants.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const optionTypes = form.optionTypes
        .map((opt) => ({
          name: opt.name.trim(),
          values: (opt.valuesText || "").split(",").map((v) => v.trim()).filter(Boolean),
        }))
        .filter((opt) => opt.name && opt.values.length > 0);

      const variants = (form.variants || [])
        .filter((v) => v.optionValues?.length > 0 && v.price !== "" && v.price != null)
        .map((v) => ({ ...v, price: Number(v.price), stock: Number(v.stock) || 999 }));

      const payload = {
        ...form,
        price: Number(form.price),
        category: form.category?._id || form.category || undefined,
        optionTypes,
        variants,
      };
      if (productId) await api.put(`/products/${productId}`, payload);
      else await api.post("/products", payload);
      router.push("/admin/san-pham");
    } catch (err) {
      alert(err.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 space-y-6 max-w-3xl">
      <div>
        <label className="block text-sm font-semibold mb-2">Tên sản phẩm *</label>
        <input required value={form.name} onChange={(e) => update("name", e.target.value)} className="w-full border rounded-lg px-4 py-2" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold">Danh mục</label>
            <Link href="/admin/danh-muc" target="_blank" className="text-xs text-blue-600 font-semibold hover:underline">
              + Quản lý danh mục
            </Link>
          </div>
          <select value={form.category?._id || form.category || ""} onChange={(e) => update("category", e.target.value)} className="w-full border rounded-lg px-4 py-2">
            <option value="">-- Chọn --</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">
            Giá (VNĐ) * {form.variants?.length > 0 && <span className="text-xs text-gray-400 font-normal">(giá "từ", khi chưa chọn tuỳ chọn)</span>}
          </label>
          <input required type="number" value={form.price} onChange={(e) => update("price", e.target.value)} className="w-full border rounded-lg px-4 py-2" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">
            Đơn vị {form.variants?.length > 0 && <span className="text-xs text-gray-400 font-normal">(khi không dùng biến thể)</span>}
          </label>
          <input value={form.unit} onChange={(e) => update("unit", e.target.value)} className="w-full border rounded-lg px-4 py-2" placeholder="m², cuộn..." />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Mô tả ngắn</label>
        <input value={form.shortDescription} onChange={(e) => update("shortDescription", e.target.value)} className="w-full border rounded-lg px-4 py-2" />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Mô tả chi tiết</label>
        <RichTextEditor value={form.description} onChange={(html) => update("description", html)} placeholder="Nhập mô tả chi tiết sản phẩm..." minHeight={240} />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Hình ảnh</label>
        <ImageUploader multiple value={form.images} onChange={(v) => update("images", v)} />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Thông số kỹ thuật</label>
        {form.specs.map((s, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input placeholder="Tên" value={s.label} onChange={(e) => updateSpec(i, "label", e.target.value)} className="flex-1 border rounded-lg px-3 py-2 text-sm" />
            <input placeholder="Giá trị" value={s.value} onChange={(e) => updateSpec(i, "value", e.target.value)} className="flex-1 border rounded-lg px-3 py-2 text-sm" />
            <button type="button" onClick={() => removeSpec(i)} className="text-red-500 px-2">×</button>
          </div>
        ))}
        <button type="button" onClick={addSpec} className="text-sm text-blue-600 font-semibold">+ Thêm thông số</button>
      </div>

      {/* ---- Tuỳ chọn & Biến thể giá ---- */}
      <div className="border-t pt-6">
        <label className="block text-sm font-semibold mb-1">Tuỳ chọn sản phẩm (màu sắc, kích thước, đơn vị tính...)</label>
        <p className="text-xs text-gray-500 mb-4">
          Thêm các loại tuỳ chọn khách có thể chọn — mỗi tổ hợp sẽ có giá riêng. Để trống nếu sản phẩm chỉ có 1 giá duy nhất.
        </p>

        {form.optionTypes.map((opt, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input
              placeholder="Tên tuỳ chọn (VD: Màu sắc)"
              value={opt.name}
              onChange={(e) => updateOptionType(idx, "name", e.target.value)}
              className="w-48 border rounded-lg px-3 py-2 text-sm"
            />
            <input
              placeholder="Các giá trị, cách nhau bằng dấu phẩy (VD: Trắng, Đen, Xám)"
              value={opt.valuesText}
              onChange={(e) => updateOptionType(idx, "valuesText", e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
            />
            <button type="button" onClick={() => removeOptionType(idx)} className="text-red-500 px-2">×</button>
          </div>
        ))}
        <div className="flex items-center gap-4 mt-2">
          <button type="button" onClick={addOptionType} className="text-sm text-blue-600 font-semibold">+ Thêm loại tuỳ chọn</button>
          {form.optionTypes.length > 0 && (
            <button type="button" onClick={regenerateVariants} className="text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg font-semibold">
              🔄 Tạo / Cập nhật biến thể giá
            </button>
          )}
        </div>

        {form.variants?.length > 0 && (
          <div className="mt-5">
            <label className="block text-sm font-semibold mb-2">Bảng giá theo biến thể ({form.variants.length} tổ hợp)</label>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="p-3">Tổ hợp</th>
                    <th className="p-3 w-32">Giá (VNĐ)</th>
                    <th className="p-3 w-24">Kho</th>
                    <th className="p-3 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {form.variants.map((v, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-3">{v.optionValues.join(" / ")}</td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={v.price}
                          onChange={(e) => updateVariant(idx, "price", e.target.value)}
                          className="w-full border rounded px-2 py-1"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={v.stock}
                          onChange={(e) => updateVariant(idx, "stock", e.target.value)}
                          className="w-full border rounded px-2 py-1"
                        />
                      </td>
                      <td className="p-3 text-right">
                        <button type="button" onClick={() => removeVariant(idx)} className="text-red-500">×</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Nếu sửa lại tên/giá trị tuỳ chọn ở trên, bấm "🔄 Tạo / Cập nhật biến thể giá" lần nữa — các tổ hợp còn giữ nguyên tên sẽ giữ giá đã nhập.
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isNew} onChange={(e) => update("isNew", e.target.checked)} /> Sản phẩm mới</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFeatured} onChange={(e) => update("isFeatured", e.target.checked)} /> Nổi bật (hiện ở trang chủ)</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isPublished} onChange={(e) => update("isPublished", e.target.checked)} /> Hiển thị công khai</label>
      </div>

      <button disabled={saving} className="bg-[#fae519] font-bold px-8 py-3 rounded-lg disabled:opacity-50">
        {saving ? "Đang lưu..." : "Lưu sản phẩm"}
      </button>
    </form>
  );
}
