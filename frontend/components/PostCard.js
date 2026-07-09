import Link from "next/link";
import Image from "next/image";

export default function PostCard({ post, size = "normal" }) {
  const date = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("vi-VN") : "";
  return (
    <Link
      href={`/tin-tuc/${post.slug}`}
      className="group block rounded-xl overflow-hidden border border-on-background/10 hover:shadow-lg transition-shadow bg-white"
    >
      <div className={`relative w-full ${size === "large" ? "aspect-[16/9]" : "aspect-[4/3]"} overflow-hidden bg-surface`}>
        {post.coverImage && (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width:768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
      </div>
      <div className="p-5">
        {post.category?.name && (
          <span className="text-xs uppercase tracking-widest text-secondary font-bold">{post.category.name}</span>
        )}
        <h3 className="font-heading font-semibold text-lg mt-1 mb-2 line-clamp-2">{post.title}</h3>
        <p className="text-sm text-on-background/60 mb-3 line-clamp-2">{post.excerpt}</p>
        <div className="flex items-center gap-3 text-xs text-on-background/50">
          <span>{date}</span>
          {post.author && <span>· {post.author}</span>}
        </div>
      </div>
    </Link>
  );
}
