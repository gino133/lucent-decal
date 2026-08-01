// sinh JSON-LD FAQPage Schema từ các cặp hỏi–đáp lấy được trong nội dung bài viết
// (xem hàm extractFaqPairs ở frontend/lib/richtext.js). Nếu bài viết có nội dung
// hỏi–đáp và đánh dấu đúng chuẩn, Google có thể xổ trực tiếp từng câu hỏi ngay
// dưới link tìm kiếm. Xem thêm: https://schema.org/FAQPage
export default function FaqSchema({ faqs }) {
  if (!faqs || faqs.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
