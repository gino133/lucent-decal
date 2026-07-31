// Nội dung rich-text (bài viết, mô tả sản phẩm/dự án...) đôi khi được dán từ
// Word / Google Docs / ChatGPT vào ô soạn thảo, mang theo mấy kiểu "rác" sau đây
// mà chỉ CSS thôi thì không sửa được — phải xử lý ngay trên chuỗi HTML trước khi
// render, để áp dụng được luôn cho cả nội dung cũ đã lưu sẵn trong database.
export function sanitizeRichHtml(html) {
  if (!html || typeof html !== "string") return html || "";
  let out = html;

  // 1) Khoảng trắng không ngắt được (&nbsp; / U+00A0) giữa mọi từ.
  //    &nbsp; theo định nghĩa không bao giờ được ngắt dòng ở đó, nên cả câu dính
  //    liền thành 1 chuỗi không ngắt được -> tràn khung hoặc bị cắt bừa giữa từ.
  out = out.replace(/&nbsp;/gi, " ").replace(/\u00A0/g, " ");

  // 2) Màu nền (background-color / background) dính theo từng đoạn chữ khi dán từ
  //    Word/Docs — thường là màu nền trắng của trang giấy gốc, nhưng khi hiển thị
  //    trên nền trang web lại thành từng ô highlight loang lổ sau chữ. Bỏ hẳn phần
  //    khai báo màu nền trong style nội tuyến, giữ nguyên các thuộc tính khác
  //    (màu chữ, in đậm...) để không mất định dạng thật sự cần thiết.
  out = out.replace(/background(-color)?\s*:\s*[^;"']+;?/gi, "");

  // 3) Nhiều thẻ <h1> trong cùng 1 bài (thường do dán nguyên Heading 1 từ Word).
  //    Mỗi trang chỉ nên có 1 H1 để không làm loãng chủ đề chính với Google — giữ
  //    nguyên H1 đầu tiên, các H1 thừa phía sau tự động hạ xuống H2.
  let h1Count = 0;
  out = out.replace(/<h1(\s[^>]*)?>([\s\S]*?)<\/h1>/gi, (match, attrs = "", inner) => {
    h1Count++;
    if (h1Count === 1) return match;
    return `<h2${attrs || ""}>${inner}</h2>`;
  });

  return out;
}
