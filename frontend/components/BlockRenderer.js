import Image from "next/image";
import Link from "next/link";
import { getProducts, getProjects, getPosts } from "@/lib/api";
import ProductCard from "./ProductCard";
import ProjectCard from "./ProjectCard";
import PostCard from "./PostCard";
import ContactForm from "./ContactForm";

// Mỗi block trong trang (được quản lý ở /admin/trang) sẽ render tương ứng ở đây.
export default async function BlockRenderer({ blocks = [] }) {
  const visible = [...blocks]
    .filter((b) => b && b.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
  return (
    <>
      {visible.map((block, idx) => (
        <SafeBlock key={block._id || idx} block={block} />
      ))}
    </>
  );
}

// Bọc an toàn: nếu 1 khối bị lỗi khi render (VD: ảnh hỏng, dữ liệu thiếu),
// chỉ khối đó bị bỏ qua — không làm sập toàn bộ trang.
// Lỗi thật sẽ được in ra Vercel Function Logs để dễ chẩn đoán.
async function SafeBlock({ block }) {
  try {
    return await Block({ block });
  } catch (err) {
    console.error(`[BlockRenderer] Lỗi khi render khối "${block?.type}":`, err);
    return null;
  }
}

async function Block({ block }) {
  const { type, data = {} } = block || {};

  if (type === "hero") {
    return (
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="font-heading font-bold text-4xl md:text-6xl leading-tight whitespace-pre-line mb-6">
              {data.title}
            </h1>
            {data.subtitle && <p className="text-lg text-on-background/70 mb-8 max-w-xl">{data.subtitle}</p>}
            {data.ctaText && (
              <Link href={data.ctaLink || "#"} className="inline-block btn-primary px-8 py-4 rounded-lg lemon-glow">
                {data.ctaText}
              </Link>
            )}
          </div>
          {data.image && (
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
              <Image src={data.image} alt={data.title || ""} fill className="object-cover" priority />
            </div>
          )}
        </div>
      </section>
    );
  }

  if (type === "richtext") {
    return (
      <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-12">
        <div className="rich-content max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: data.html || "" }} />
      </section>
    );
  }

  if (type === "imageText") {
    const reverse = data.imagePosition === "right";
    return (
      <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-12">
        <div className={`grid md:grid-cols-2 gap-10 items-center ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}>
          {data.image && (
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
              <Image src={data.image} alt={data.title || ""} fill className="object-cover" />
            </div>
          )}
          <div>
            {data.title && <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">{data.title}</h2>}
            <div className="rich-content" dangerouslySetInnerHTML={{ __html: data.html || "" }} />
          </div>
        </div>
      </section>
    );
  }

  if (type === "stats") {
    return (
      <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {(data.items || []).map((s, i) => (
            <div key={i}>
              <div className="font-heading text-3xl md:text-5xl font-bold text-secondary mb-2">{s.number}</div>
              <div className="text-sm text-on-background/70">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (type === "gallery") {
    return (
      <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-12">
        {data.title && <h2 className="font-heading text-2xl md:text-3xl font-bold mb-8">{data.title}</h2>}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(data.images || []).map((src, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
              <Image src={src} alt="" fill className="object-cover" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (type === "cta") {
    return (
      <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-16">
        <div className="bg-surface rounded-2xl p-10 md:p-20 text-center">
          <h2 className="font-heading text-2xl md:text-4xl font-bold mb-6">{data.title}</h2>
          {data.description && <p className="text-on-background/70 mb-8 max-w-2xl mx-auto">{data.description}</p>}
          {data.ctaText && (
            <Link href={data.ctaLink || "#"} className="inline-block btn-primary px-10 py-4 rounded-lg lemon-glow">
              {data.ctaText}
            </Link>
          )}
        </div>
      </section>
    );
  }

  if (type === "productsFeatured") {
    const res = await getProducts("?featured=true&limit=8");
    const products = res?.items || [];
    if (!products.length) return null;
    return (
      <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold">{data.title || "Sản phẩm nổi bật"}</h2>
          <Link href="/san-pham" className="text-sm font-semibold hover:text-secondary">Xem tất cả →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </section>
    );
  }

  if (type === "postsFeatured") {
    const res = await getPosts("?featured=true&limit=3");
    let posts = res?.items || [];
    if (posts.length === 0) {
      const fallback = await getPosts("?limit=3");
      posts = fallback?.items || [];
    }
    if (!posts.length) return null;
    return (
      <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold">{data.title || "Tin tức mới nhất"}</h2>
          <Link href="/tin-tuc" className="text-sm font-semibold hover:text-secondary">Xem tất cả →</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((p) => <PostCard key={p._id} post={p} />)}
        </div>
      </section>
    );
  }

  if (type === "projectsFeatured") {
    const res = await getProjects("?featured=true&limit=3");
    const projects = res?.items || [];
    if (!projects.length) return null;
    return (
      <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold">{data.title || "Dự án tiêu biểu"}</h2>
          <Link href="/du-an" className="text-sm font-semibold hover:text-secondary">Xem tất cả →</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((p) => <ProjectCard key={p._id} project={p} />)}
        </div>
      </section>
    );
  }

  if (type === "contactForm") {
    return (
      <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-12">
        <ContactForm />
      </section>
    );
  }

  if (type === "map") {
    return (
      <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-12">
        <div className="w-full aspect-[16/7] rounded-2xl overflow-hidden bg-surface flex items-center justify-center text-on-background/40">
          {data.embedUrl ? (
            <iframe src={data.embedUrl} className="w-full h-full border-0" loading="lazy" />
          ) : (
            "Bản đồ (cấu hình embedUrl trong trang quản trị)"
          )}
        </div>
      </section>
    );
  }

  if (type === "logos") {
    return (
      <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-12">
        {data.title && <h2 className="font-heading text-2xl font-bold mb-8 text-center">{data.title}</h2>}
        <div className="flex flex-wrap justify-center gap-10 opacity-70">
          {(data.logos || []).map((src, i) => (
            <div key={i} className="relative w-28 h-14"><Image src={src} alt="" fill className="object-contain" /></div>
          ))}
        </div>
      </section>
    );
  }

  return null;
}
