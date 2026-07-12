"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";
import ProductCard from "./ProductCard";
import ProjectCard from "./ProjectCard";
import PostCard from "./PostCard";
import ContactForm from "./ContactForm";

// Bản "song sinh" của BlockRenderer.js dùng riêng cho khung xem trước trực tiếp
// trong trang quản trị (/admin/trang) — vì đây là component phía client (có thể
// dùng useState/useEffect để tự lấy dữ liệu thật), trong khi BlockRenderer.js là
// Server Component (chỉ chạy được khi render trang công khai thật sự).
// Hai file dùng CHUNG các class Tailwind để đảm bảo xem trước khớp với bản thật.
export default function PreviewRenderer({ blocks = [] }) {
  const visible = [...blocks]
    .filter((b) => b && b.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  if (visible.length === 0) {
    return (
      <div className="py-24 text-center text-on-background/40 text-sm">
        Chưa có khối nội dung nào — thêm khối ở bên để xem trước tại đây.
      </div>
    );
  }

  return (
    <>
      {visible.map((block, idx) => (
        <PreviewBlock key={block._id || idx} block={block} />
      ))}
    </>
  );
}

function PreviewBlock({ block }) {
  const { type, data = {} } = block || {};

  if (type === "hero") {
    return (
      <section className="relative pt-16 pb-12 md:pt-20 md:pb-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="font-heading font-bold text-3xl md:text-5xl leading-tight whitespace-pre-line mb-4">
              {data.title || <span className="text-on-background/30">(Chưa có tiêu đề)</span>}
            </h1>
            {data.subtitle && <p className="text-base text-on-background/70 mb-6 max-w-xl">{data.subtitle}</p>}
            {data.ctaText && (
              <span className="inline-block btn-primary px-6 py-3 rounded-lg">{data.ctaText}</span>
            )}
          </div>
          {data.image && (
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
              <Image src={data.image} alt={data.title || ""} fill className="object-cover" unoptimized />
            </div>
          )}
        </div>
      </section>
    );
  }

  if (type === "richtext") {
    return (
      <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-8">
        <div className="rich-content max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: data.html || "" }} />
      </section>
    );
  }

  if (type === "imageText") {
    const reverse = data.imagePosition === "right";
    return (
      <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-8">
        <div className={`grid md:grid-cols-2 gap-8 items-center ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}>
          {data.image && (
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
              <Image src={data.image} alt={data.title || ""} fill className="object-cover" unoptimized />
            </div>
          )}
          <div>
            {data.title && <h2 className="font-heading text-xl md:text-2xl font-bold mb-3">{data.title}</h2>}
            <div className="rich-content" dangerouslySetInnerHTML={{ __html: data.html || "" }} />
          </div>
        </div>
      </section>
    );
  }

  if (type === "stats") {
    return (
      <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {(data.items || []).map((s, i) => (
            <div key={i}>
              <div className="font-heading text-2xl md:text-4xl font-bold text-secondary mb-1">{s.number}</div>
              <div className="text-sm text-on-background/70">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (type === "gallery") {
    return (
      <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-8">
        {data.title && <h2 className="font-heading text-xl md:text-2xl font-bold mb-6">{data.title}</h2>}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(data.images || []).map((src, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
              <Image src={src} alt="" fill className="object-cover" unoptimized />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (type === "cta") {
    return (
      <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-10">
        <div className="bg-surface rounded-2xl p-8 md:p-14 text-center">
          <h2 className="font-heading text-xl md:text-3xl font-bold mb-4">{data.title}</h2>
          {data.description && <p className="text-on-background/70 mb-6 max-w-2xl mx-auto">{data.description}</p>}
          {data.ctaText && <span className="inline-block btn-primary px-8 py-3 rounded-lg">{data.ctaText}</span>}
        </div>
      </section>
    );
  }

  if (type === "featureCards") {
    const items = data.items || [];
    if (!items.length) return <PreviewEmptyHint label="Lưới nội dung tuỳ chỉnh — chưa có thẻ nào" />;
    const cols = data.columns === 2 ? "md:grid-cols-2" : data.columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
    return (
      <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-10">
        {data.title && <h2 className="font-heading text-xl md:text-2xl font-bold mb-6">{data.title}</h2>}
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${cols} gap-5`}>
          {items.map((item, i) => (
            <div key={i} className="block rounded-xl overflow-hidden border border-on-background/10 bg-white">
              {item.image && (
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-surface">
                  <Image src={item.image} alt={item.title || ""} fill className="object-cover" unoptimized />
                </div>
              )}
              <div className="p-4">
                {item.title && <h3 className="font-heading font-semibold text-base mb-1">{item.title}</h3>}
                {item.description && <p className="text-sm text-on-background/60 mb-2 line-clamp-3">{item.description}</p>}
                {item.linkText && <span className="text-sm font-semibold">{item.linkText} →</span>}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (type === "productsFeatured") return <PreviewCardsFromApi title={data.title || "Sản phẩm nổi bật"} fetchUrl="/products?featured=true&limit=8" itemKey="items" Card={ProductCard} cardProp="product" cols="md:grid-cols-4" />;
  if (type === "projectsFeatured") return <PreviewCardsFromApi title={data.title || "Dự án tiêu biểu"} fetchUrl="/projects?featured=true&limit=3" itemKey="items" Card={ProjectCard} cardProp="project" cols="md:grid-cols-3" />;
  if (type === "postsFeatured") return <PreviewCardsFromApi title={data.title || "Tin tức mới nhất"} fetchUrl="/posts?featured=true&limit=3" itemKey="items" Card={PostCard} cardProp="post" cols="md:grid-cols-3" />;

  if (type === "contactForm") {
    return (
      <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-8">
        <ContactForm />
      </section>
    );
  }

  if (type === "map") {
    return (
      <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-8">
        <div className="w-full aspect-[16/7] rounded-2xl overflow-hidden bg-surface flex items-center justify-center text-on-background/40 text-sm">
          {data.embedUrl ? <iframe src={data.embedUrl} className="w-full h-full border-0" loading="lazy" /> : "Bản đồ (cấu hình embedUrl)"}
        </div>
      </section>
    );
  }

  if (type === "logos") {
    return (
      <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-8">
        {data.title && <h2 className="font-heading text-xl font-bold mb-6 text-center">{data.title}</h2>}
        <div className="flex flex-wrap justify-center gap-8 opacity-70">
          {(data.logos || []).map((src, i) => (
            <div key={i} className="relative w-24 h-12"><Image src={src} alt="" fill className="object-contain" unoptimized /></div>
          ))}
        </div>
      </section>
    );
  }

  return null;
}

// Khối tự động (Sản phẩm/Dự án/Tin tức nổi bật) — lấy dữ liệu thật qua API công khai
// để khung xem trước hiển thị đúng nội dung thật, không phải dữ liệu giả.
function PreviewCardsFromApi({ title, fetchUrl, Card, cardProp, cols }) {
  const [items, setItems] = useState(null); // null = đang tải

  useEffect(() => {
    let cancelled = false;
    api.get(fetchUrl).then((res) => {
      if (!cancelled) setItems(res.data?.items || []);
    }).catch(() => { if (!cancelled) setItems([]); });
    return () => { cancelled = true; };
  }, [fetchUrl]);

  if (items === null) {
    return <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-10 text-sm text-on-background/40">Đang tải dữ liệu thật để xem trước...</div>;
  }
  if (items.length === 0) return <PreviewEmptyHint label={`${title} — chưa có mục nào được đánh dấu "Nổi bật"`} />;

  return (
    <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-10">
      <h2 className="font-heading text-xl md:text-2xl font-bold mb-6">{title}</h2>
      <div className={`grid grid-cols-2 ${cols} gap-4`}>
        {items.map((item) => <Card key={item._id} {...{ [cardProp]: item }} />)}
      </div>
    </section>
  );
}

function PreviewEmptyHint({ label }) {
  return (
    <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-10">
      <div className="border-2 border-dashed border-on-background/15 rounded-xl p-8 text-center text-sm text-on-background/40">
        {label}
      </div>
    </div>
  );
}
