// sinh JSON-LD Local Business Schema từ Cài đặt admin nhập, giúp Google hiểu
// đây là doanh nghiệp local. Xem thêm: https://schema.org/LocalBusiness
export default function LocalBusinessSchema({ settings }) {
  if (!settings) return null;

  const siteUrl = settings.seo?.siteUrl || "";
  const sameAs = Object.values(settings.social || {}).filter(Boolean);

  const schema = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: settings.siteName || "Website",
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
