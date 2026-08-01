import Link from "next/link";
import { getPost, getPosts, getSettings } from "@/lib/api";
import PostCard from "@/components/PostCard";
import CommentSection from "@/components/CommentSection";
import ClickableImage from "@/components/ClickableImage";
import FaqSchema from "@/components/FaqSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import ArticleSchema from "@/components/ArticleSchema";
import { sanitizeRichHtml, extractFaqPairs } from "@/lib/richtext";
import { notFound } from "next/navigation";

export default async function PostDetailPage({ params }) {
  const [post, settings] = await Promise.all([getPost(params.slug), getSettings()]);
  if (!post) return notFound();

  const siteUrl = (settings?.seo?.siteUrl || "").replace(/\/$/, "");
  const cleanContent = sanitizeRichHtml(post.content);
  const faqs = extractFaqPairs(cleanContent);
  const breadcrumbItems = [
    { name: "Trang chủ", url: siteUrl ? `${siteUrl}/` : undefined },
    { name: "Tin tức", url: siteUrl ? `${siteUrl}/tin-tuc` : undefined },
    ...(post.category?.name
      ? [{ name: post.category.name, url: siteUrl ? `${siteUrl}/tin-tuc?category=${post.category.slug}` : undefined }]
      : []),
    { name: post.title },
  ];

  const date = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("vi-VN") : "";

  // Bài viết liên quan: cùng danh mục, loại trừ chính bài đang xem
  const relatedRes = post.category?._id
    ? await getPosts(`?category=${post.category._id}&limit=4`)
    : await getPosts(`?limit=4`);
  const related = (relatedRes?.items || []).filter((p) => p._id !== post._id).slice(0, 3);

  return (
    <div className="pt-32 pb-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <ArticleSchema post={post} settings={settings} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <FaqSchema faqs={faqs} />

      <div className="text-sm text-on-background/50 mb-6 flex items-center gap-1 flex-wrap">
        <Link href="/" className="hover:text-secondary hover:underline">Trang chủ</Link>
        <span>/</span>
        <Link href="/tin-tuc" className="hover:text-secondary hover:underline">Tin tức</Link>
        {post.category?.name && (
          <>
            <span>/</span>
            <Link href={`/tin-tuc?category=${post.category.slug}`} className="hover:text-secondary hover:underline">
              {post.category.name}
            </Link>
          </>
        )}
      </div>

      <div className="max-w-3xl mx-auto">
        {post.category?.name && (
          <span className="text-xs uppercase tracking-widest text-secondary font-bold">{post.category.name}</span>
        )}
        <h1 className="font-heading text-3xl md:text-5xl font-bold mt-2 mb-4">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-on-background/50 mb-8">
          <span>{date}</span>
          {post.author && <span>· {post.author}</span>}
          <span>· {post.views} lượt xem</span>
        </div>

        {post.coverImage && (
          <ClickableImage
            src={post.coverImage}
            alt={post.title}
            className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-10"
            imgClassName="object-cover"
            priority
          />
        )}

        {post.content && (
          <div className="rich-content" dangerouslySetInnerHTML={{ __html: cleanContent }} />
        )}

        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs bg-surface px-3 py-1.5 rounded-full text-on-background/60">#{tag}</span>
            ))}
          </div>
        )}

        <CommentSection postId={post._id} />
      </div>

      {related.length > 0 && (
        <div className="max-w-container-max mx-auto mt-20">
          <h2 className="font-heading text-2xl font-bold mb-8">Bài viết liên quan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((p) => <PostCard key={p._id} post={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
