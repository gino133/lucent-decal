// sinh JSON-LD BreadcrumbList Schema, khớp với breadcrumb đang hiển thị trên trang
// (VD: Trang chủ / Dự án / Nhà Ở / ...). Giúp Google hiện đường dẫn breadcrumb ngay
// trên kết quả tìm kiếm thay vì hiện URL thô. Xem thêm: https://schema.org/BreadcrumbList
// items: mảng { name, url } theo đúng thứ tự hiển thị, url là đường dẫn tuyệt đối (kèm domain)
export default function BreadcrumbSchema({ items }) {
  if (!items || items.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.url && { item: item.url }),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
