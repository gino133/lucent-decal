// Nội dung rich-text (bài viết, mô tả sản phẩm/dự án...) đôi khi được dán từ
// Word / Google Docs / ChatGPT vào ô soạn thảo. Các nguồn đó thường chèn "&nbsp;"
// (khoảng trắng không ngắt được) giữa MỌI từ thay vì dấu cách thường.
//
// Hệ quả: trình duyệt không có chỗ nào để xuống dòng trong cả câu (vì &nbsp; theo
// định nghĩa không bao giờ được ngắt dòng ở đó), nên cả đoạn dính liền thành 1
// chuỗi dài không ngắt được -> tràn khung, hoặc bị trình duyệt cắt bừa giữa từ để
// khỏi tràn. Không có cách nào sửa việc này chỉ bằng CSS.
//
// Hàm này thay toàn bộ &nbsp; / U+00A0 bằng dấu cách thường trước khi render,
// để trình duyệt xuống dòng bình thường ở dấu cách như mọi văn bản khác — áp dụng
// được ngay cho cả bài viết cũ đã lưu trong database lẫn bài mới, không cần sửa tay.
export function sanitizeRichHtml(html) {
  if (!html || typeof html !== "string") return html || "";
  return html.replace(/&nbsp;/gi, " ").replace(/\u00A0/g, " ");
}
