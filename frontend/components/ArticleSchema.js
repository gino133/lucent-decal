import { stripHtmlTags } from "@/lib/richtext";

// sinh JSON-LD BlogPosting Schema cho trang chi tiết bài viết — giúp Google hiểu
// tác giả, ngày đăng, ảnh đại diện của bài. Xem thêm: https://schema.org/BlogPosting
export default function ArticleSchema({ post, settings }) {
  if (!post) return null;

  const siteUrl = settings?.seo?.siteUrl || "";
  const url = siteUrl ? `${siteUrl}/tin-tuc/${post.slug}` : undefined;
  const published = post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined;
  const modified = post.updatedAt ? new Date(post.updatedAt).toISOString() : published;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    ...(post.excerpt && { description: stripHtmlTags(post.excerpt).slice(0, 300) }),
    ...(post.coverImage && { image: [post.coverImage] }),
    ...(url && { url, mainEntityOfPage: { "@type": "WebPage", "@id": url } }),
    ...(published && { datePublished: published }),
    ...(modified && { dateModified: modified }),
    author: { "@type": "Person", name: post.author || "Admin" },
    ...(settings?.siteName && {
      publisher: {
        "@type": "Organization",
        name: settings.siteName,
        ...(settings.logoUrl && { logo: { "@type": "ImageObject", url: settings.logoUrl } }),
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
