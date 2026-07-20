"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import MediaLibraryModal from "./MediaLibraryModal";

// Font cho phép chọn, trùng danh sách font ở trang Giao diện & Cài đặt
const FONT_CHOICES = [
  "Montserrat", "Inter", "Poppins", "Roboto", "Playfair Display",
  "Lora", "Nunito", "Raleway", "Open Sans", "Merriweather",
];
const SIZE_CHOICES = ["12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px", "40px"];

let formatsRegistered = false;
function registerFormats(Quill) {
  if (formatsRegistered) return;
  // dùng inline style thay vì class ql-* để HTML xuất ra hiển thị đúng luôn,
  // kể cả ở trang công khai không tải CSS của Quill
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

const GOOGLE_FONTS_LINK_ID = "rte-google-fonts";

// trình soạn thảo trực quan, thay cho gõ HTML tay
export default function RichTextEditor({ value, onChange, placeholder, minHeight = 180 }) {
  const quillRef = useRef(null);
  const savedRange = useRef(null);
  const [imagePickerOpen, setImagePickerOpen] = useState(false);

  // nút chèn ảnh trong thanh công cụ mở thư viện/ tải ảnh mới, thay vì Quill mặc định
  // (Quill mặc định nhúng thẳng base64 vào bài viết, nặng và không tái sử dụng được ảnh)
  function openImagePicker() {
    const editor = quillRef.current?.getEditor();
    savedRange.current = editor?.getSelection(true) || savedRange.current;
    setImagePickerOpen(true);
  }

  function insertImage(url) {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;
    const range = savedRange.current || editor.getSelection(true) || { index: editor.getLength() };
    editor.insertEmbed(range.index, "image", url, "user");
    editor.setSelection(range.index + 1);
  }

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ font: [false, ...FONT_CHOICES] }, { size: [false, ...SIZE_CHOICES] }],
        ["bold", "italic", "underline", "strike"],
        [{ header: 2 }, { header: 3 }],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote", "link", "image"],
        ["clean"],
      ],
      handlers: { image: openImagePicker },
    },
  }), []);

  // nạp Google Fonts 1 lần để xem trước đúng font lúc soạn
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
        ref={quillRef}
        theme="snow"
        value={value || ""}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
      />
      <style dangerouslySetInnerHTML={{ __html: `.rte-wrapper .ql-editor { min-height: ${minHeight}px; } .rte-wrapper .ql-editor img { max-width: 100%; }` }} />

      {imagePickerOpen && (
        <MediaLibraryModal onClose={() => setImagePickerOpen(false)} onSelect={insertImage} />
      )}
    </div>
  );
}

// Quill không tự hiện tên font/cỡ chữ tuỳ biến trong menu chọn, phải tự sinh CSS cho nó
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
