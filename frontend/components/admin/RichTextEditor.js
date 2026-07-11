"use client";
import { useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// Font cho phép chọn — dùng đúng tên CSS font-family thật (giữ dấu cách),
// trùng với danh sách font hệ thống ở trang Giao diện & Cài đặt.
const FONT_CHOICES = [
  "Montserrat", "Inter", "Poppins", "Roboto", "Playfair Display",
  "Lora", "Nunito", "Raleway", "Open Sans", "Merriweather",
];
const SIZE_CHOICES = ["12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px", "40px"];

let formatsRegistered = false;
function registerFormats(Quill) {
  if (formatsRegistered) return;
  // Đăng ký font/cỡ chữ/canh lề dưới dạng INLINE STYLE (không phải class ql-*),
  // để HTML xuất ra có style="..." trực tiếp, hiển thị đúng ở mọi nơi — kể cả
  // trang công khai của website không tải CSS của Quill.
  const FontStyle = Quill.import("attributors/style/font");
  FontStyle.whitelist = FONT_CHOICES;
  Quill.register(FontStyle, true);

  const SizeStyle = Quill.import("attributors/style/size");
  SizeStyle.whitelist = SIZE_CHOICES;
  Quill.register(SizeStyle, true);

  const AlignStyle = Quill.import("attributors/style/align");
  Quill.register(AlignStyle, true);

  formatsRegistered = true;
}

const ReactQuill = dynamic(
  async () => {
    const { default: RQ, Quill } = await import("react-quill-new");
    registerFormats(Quill);
    return RQ;
  },
  {
    ssr: false,
    loading: () => <div className="border rounded-lg p-4 text-sm text-gray-400" style={{ minHeight: 180 }}>Đang tải trình soạn thảo...</div>,
  }
);

const TOOLBAR_MODULES = {
  toolbar: [
    [{ font: [false, ...FONT_CHOICES] }, { size: [false, ...SIZE_CHOICES] }],
    ["bold", "italic", "underline", "strike"],
    [{ header: 2 }, { header: 3 }],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "link"],
    ["clean"],
  ],
};

const GOOGLE_FONTS_LINK_ID = "rte-google-fonts";

// Trình soạn thảo trực quan (WYSIWYG) — thay cho việc gõ HTML thủ công.
// Cho phép đổi font chữ, cỡ chữ, in đậm/nghiêng, màu, canh lề, gắn link... bằng nút bấm.
export default function RichTextEditor({ value, onChange, placeholder, minHeight = 180 }) {
  const modules = useMemo(() => TOOLBAR_MODULES, []);

  // Nạp Google Fonts 1 lần cho toàn trang admin để xem trước đúng font khi soạn nội dung
  useEffect(() => {
    if (document.getElementById(GOOGLE_FONTS_LINK_ID)) return;
    const link = document.createElement("link");
    link.id = GOOGLE_FONTS_LINK_ID;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?${FONT_CHOICES.map((f) => `family=${f.replace(/ /g, "+")}:wght@400;500;600;700`).join("&")}&display=swap`;
    document.head.appendChild(link);
  }, []);

  return (
    <div className="rte-wrapper">
      <style dangerouslySetInnerHTML={{ __html: pickerLabelCSS() }} />
      <ReactQuill
        theme="snow"
        value={value || ""}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
      />
      <style dangerouslySetInnerHTML={{ __html: `.rte-wrapper .ql-editor { min-height: ${minHeight}px; }` }} />
    </div>
  );
}

// Quill không có sẵn tên hiển thị cho font/cỡ chữ tuỳ biến — phải tự sinh CSS
// để menu chọn hiện đúng tên (VD: "Playfair Display") thay vì để trống.
function pickerLabelCSS() {
  const fontRules = FONT_CHOICES.map(
    (f) => `
    .rte-wrapper .ql-picker.ql-font .ql-picker-label[data-value="${f}"]::before,
    .rte-wrapper .ql-picker.ql-font .ql-picker-item[data-value="${f}"]::before {
      content: "${f}";
      font-family: "${f}", sans-serif;
    }`
  ).join("\n");

  const sizeRules = SIZE_CHOICES.map(
    (s) => `
    .rte-wrapper .ql-picker.ql-size .ql-picker-label[data-value="${s}"]::before,
    .rte-wrapper .ql-picker.ql-size .ql-picker-item[data-value="${s}"]::before {
      content: "${s}";
    }`
  ).join("\n");

  return fontRules + sizeRules;
}
