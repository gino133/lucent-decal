// Sinh mã Local Business Schema (JSON-LD) từ dữ liệu Cài đặt (Setting) do admin nhập,
// giúp Google hiểu đây là 1 doanh nghiệp địa phương (tên, địa chỉ, SĐT, giờ mở cửa, mạng xã hội...)
// Tham khảo: https://schema.org/LocalBusiness
export default function LocalBusinessSchema({ settings }) {
  if (!settings) return null;

  const siteUrl = settings.seo?.siteUrl || "";
  const sameAs = Object.values(settings.social || {}).filter(Boolean);

  const schema = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: settings.siteName || "Lucent Glass",
    description: settings.seo?.metaDescription || settings.tagline || "",
    ...(siteUrl && { "@id": siteUrl, url: siteUrl }),
    ...(settings.logoUrl && { image: settings.logoUrl, logo: settings.logoUrl }),
    ...(settings.contact?.phone && { telephone: settings.contact.phone }),
    ...(settings.contact?.email && { email: settings.contact.email }),
    ...(settings.contact?.address && {
      address: { "@type": "PostalAddress", streetAddress: settings.contact.address, addressCountry: "VN" },
    }),
    ...(settings.contact?.workingHours && { openingHours: settings.contact.workingHours }),
    ...(settings.seo?.priceRange && { priceRange: settings.seo.priceRange }),
    ...(sameAs.length > 0 && { sameAs }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
