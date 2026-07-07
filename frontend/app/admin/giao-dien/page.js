"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import ImageUploader from "@/components/admin/ImageUploader";

const FONT_OPTIONS = ["Montserrat", "Inter", "Poppins", "Roboto", "Playfair Display", "Lora", "Nunito", "Raleway", "Open Sans", "Merriweather"];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { api.get("/settings").then((res) => setSettings(res.data)); }, []);

  function update(path, value) {
    setSettings((s) => {
      const next = { ...s };
      const keys = path.split(".");
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]] = { ...obj[keys[i]] };
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  }

  async function save() {
    setSaving(true);
    await api.put("/settings", settings);
    setSaving(false);
    alert("Đã lưu cài đặt! Tải lại trang chủ để xem thay đổi.");
  }

  if (!settings) return <p>Đang tải...</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-8">Giao diện & Cài đặt</h1>

      <div className="bg-white rounded-xl p-8 space-y-6 mb-6">
        <h2 className="font-bold text-lg">Thông tin chung</h2>
        <div>
          <label className="block text-sm font-semibold mb-2">Tên website</label>
          <input value={settings.siteName} onChange={(e) => update("siteName", e.target.value)} className="w-full border rounded-lg px-4 py-2" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Khẩu hiệu (tagline)</label>
          <input value={settings.tagline} onChange={(e) => update("tagline", e.target.value)} className="w-full border rounded-lg px-4 py-2" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Logo</label>
          <ImageUploader value={settings.logoUrl} onChange={(v) => update("logoUrl", v)} />
        </div>
      </div>

      <div className="bg-white rounded-xl p-8 space-y-6 mb-6">
        <h2 className="font-bold text-lg">Màu sắc thương hiệu</h2>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(settings.colors || {}).map(([key, value]) => (
            <div key={key}>
              <label className="block text-xs font-semibold mb-2 capitalize">{key}</label>
              <div className="flex items-center gap-2">
                <input type="color" value={value} onChange={(e) => update(`colors.${key}`, e.target.value)} className="w-10 h-10 rounded" />
                <input value={value} onChange={(e) => update(`colors.${key}`, e.target.value)} className="flex-1 border rounded-lg px-2 py-1 text-xs" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-8 space-y-6 mb-6">
        <h2 className="font-bold text-lg">Font chữ</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Font tiêu đề</label>
            <select value={settings.fonts?.heading} onChange={(e) => update("fonts.heading", e.target.value)} className="w-full border rounded-lg px-4 py-2">
              {FONT_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Font nội dung</label>
            <select value={settings.fonts?.body} onChange={(e) => update("fonts.body", e.target.value)} className="w-full border rounded-lg px-4 py-2">
              {FONT_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-8 space-y-6 mb-6">
        <h2 className="font-bold text-lg">Thông tin liên hệ</h2>
        <div className="grid grid-cols-2 gap-4">
          <input placeholder="Điện thoại" value={settings.contact?.phone} onChange={(e) => update("contact.phone", e.target.value)} className="border rounded-lg px-4 py-2" />
          <input placeholder="Email" value={settings.contact?.email} onChange={(e) => update("contact.email", e.target.value)} className="border rounded-lg px-4 py-2" />
          <input placeholder="Địa chỉ" value={settings.contact?.address} onChange={(e) => update("contact.address", e.target.value)} className="border rounded-lg px-4 py-2 col-span-2" />
          <input placeholder="Giờ làm việc" value={settings.contact?.workingHours} onChange={(e) => update("contact.workingHours", e.target.value)} className="border rounded-lg px-4 py-2 col-span-2" />
        </div>
      </div>

      <div className="bg-white rounded-xl p-8 space-y-6 mb-6">
        <h2 className="font-bold text-lg">Mạng xã hội</h2>
        <div className="grid grid-cols-2 gap-4">
          <input placeholder="Facebook URL" value={settings.social?.facebook} onChange={(e) => update("social.facebook", e.target.value)} className="border rounded-lg px-4 py-2" />
          <input placeholder="Instagram URL" value={settings.social?.instagram} onChange={(e) => update("social.instagram", e.target.value)} className="border rounded-lg px-4 py-2" />
          <input placeholder="LinkedIn URL" value={settings.social?.linkedin} onChange={(e) => update("social.linkedin", e.target.value)} className="border rounded-lg px-4 py-2" />
          <input placeholder="Zalo" value={settings.social?.zalo} onChange={(e) => update("social.zalo", e.target.value)} className="border rounded-lg px-4 py-2" />
        </div>
      </div>

      <div className="bg-white rounded-xl p-8 space-y-6 mb-6">
        <h2 className="font-bold text-lg">Vận chuyển & Thuế</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-2">Miễn phí ship từ (VNĐ)</label>
            <input type="number" value={settings.shipping?.freeShippingThreshold} onChange={(e) => update("shipping.freeShippingThreshold", Number(e.target.value))} className="w-full border rounded-lg px-4 py-2" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2">Phí ship mặc định (VNĐ)</label>
            <input type="number" value={settings.shipping?.flatShippingFee} onChange={(e) => update("shipping.flatShippingFee", Number(e.target.value))} className="w-full border rounded-lg px-4 py-2" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2">VAT (%)</label>
            <input type="number" value={settings.shipping?.vatPercent} onChange={(e) => update("shipping.vatPercent", Number(e.target.value))} className="w-full border rounded-lg px-4 py-2" />
          </div>
        </div>
      </div>

      <button onClick={save} disabled={saving} className="bg-[#fae519] font-bold px-10 py-3 rounded-lg disabled:opacity-50">
        {saving ? "Đang lưu..." : "Lưu tất cả thay đổi"}
      </button>
    </div>
  );
}
