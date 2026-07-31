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
  const [counts, setCounts] = useState({ words: 0, chars: 0 });

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

  function handleChange(html) {
    onChange(html);
  }

  // đếm số từ/ký tự ngay khi mở lại nội dung đã có sẵn (sửa bài cũ), không đợi gõ thêm —
  // tính trực tiếp từ chuỗi HTML thay vì chờ Quill (Quill tải bất đồng bộ, ref có thể
  // chưa sẵn sàng ngay lúc mount)
  useEffect(() => {
    const text = (value || "").replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").trim();
    setCounts({
      chars: text.length,
      words: text ? text.split(/\s+/).filter(Boolean).length : 0,
    });
  }, [value]);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: 2 }, { header: 3 }],
        [{ font: [false, ...FONT_CHOICES] }, { size: [false, ...SIZE_CHOICES] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote", "link", "image"],
        ["clean"],
      ],
      handlers: { image: openImagePicker },
    },
    clipboard: {
      // Dán nội dung từ Word/Google Docs/ChatGPT... thường mang theo 2 loại "rác":
      // (1) khoảng trắng không ngắt được (&nbsp;) giữa mọi từ — khiến cả câu dính
      //     liền thành 1 chuỗi không thể xuống dòng khi hiển thị ngoài trang;
      // (2) màu nền trắng của trang giấy gốc, và tiêu đề Heading 1 của Word.
      // Dọn ngay lúc dán để nội dung mới luôn sạch, khớp với cách trang công khai
      // hiển thị (xem thêm hàm sanitizeRichHtml ở frontend/lib/richtext.js — hàm đó
      // vẫn được giữ lại để dọn luôn các bài viết CŨ đã lỡ lưu rác từ trước).
      matchers: [
        [3 /* Node.TEXT_NODE */, (node, delta) => {
          if (node.data) node.data = node.data.replace(/\u00A0/g, " ");
          return delta;
        }],
        [1 /* Node.ELEMENT_NODE */, (node, delta) => {
          if (node.style?.backgroundColor) node.style.backgroundColor = "";
          if (node.tagName === "H1") {
            delta.ops = delta.ops.map((op) =>
              op.attributes?.header === 1
                ? { ...op, attributes: { ...op.attributes, header: 2 } }
                : op
            );
          }
          return delta;
        }],
      ],
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

  // gắn chú thích (tooltip) cho các nút quan trọng trong thanh công cụ, Quill không tự làm việc này
  useEffect(() => {
    const root = quillRef.current?.getEditor?.()?.container?.closest(".rte-wrapper");
    if (!root) return;
    const tips = {
      '.ql-header[value="2"]': "Tiêu đề mục lớn (H2) — dùng cho từng phần chính của bài",
      '.ql-header[value="3"]': "Tiêu đề mục nhỏ (H3) — dùng cho câu hỏi FAQ, mục con bên trong 1 phần",
      ".ql-bold": "In đậm (Ctrl+B)",
      ".ql-italic": "In nghiêng (Ctrl+I)",
      ".ql-blockquote": "Trích dẫn",
      ".ql-link": "Chèn liên kết",
      ".ql-image": "Chèn ảnh từ thư viện",
      ".ql-clean": "Xoá hết định dạng đoạn đang chọn",
    };
    Object.entries(tips).forEach(([selector, title]) => {
      root.querySelectorAll(selector).forEach((el) => el.setAttribute("title", title));
    });
  }, []);

  return (
    <div className="rte-wrapper">
      <style dangerouslySetInnerHTML={{ __html: pickerLabelCSS() }} />

      {/* gợi ý cấu trúc tiêu đề để nội dung có phân cấp rõ ràng, tốt cho người đọc lẫn SEO,
          thay vì gõ chữ đậm tay cho mọi đề mục (không phải tiêu đề thật, Google không hiểu) */}
      <div className="mb-2 flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-800">
        <span className="mt-0.5">💡</span>
        <span>
          Dùng nút <strong>H2</strong> cho từng phần chính (VD: "Câu hỏi thường gặp"), <strong>H3</strong> cho mục con bên trong (VD: từng câu hỏi) —
          đừng chỉ bôi đậm chữ, tiêu đề thật giúp bài viết rõ ràng hơn và lên Google tốt hơn.
        </span>
      </div>

      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value || ""}
        onChange={handleChange}
        modules={modules}
        placeholder={placeholder || "Nhập nội dung..."}
      />
      <style dangerouslySetInnerHTML={{
        __html: `.rte-wrapper .ql-editor { min-height: ${minHeight}px; resize: vertical; overflow-y: auto; } .rte-wrapper .ql-editor img { max-width: 100%; }`,
      }} />

      <div className="mt-1.5 flex justify-end gap-3 text-[11px] text-on-background/40">
        <span>{counts.words.toLocaleString("vi-VN")} từ</span>
        <span>{counts.chars.toLocaleString("vi-VN")} ký tự</span>
      </div>

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
