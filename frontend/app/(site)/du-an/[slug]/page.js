import Image from "next/image";
import Link from "next/link";
import { getProject } from "@/lib/api";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import ClickableImage from "@/components/ClickableImage";
import { notFound } from "next/navigation";

export default async function ProjectDetailPage({ params }) {
  const project = await getProject(params.slug);
  if (!project) return notFound();

  return (
    <div className="pt-32 pb-20">
      <div className="relative w-full min-h-[300px] sm:min-h-[360px] md:min-h-[420px] mb-10 overflow-hidden flex flex-col justify-between">
        {project.coverImage && (
          <Image src={project.coverImage} alt={project.name} fill className="object-cover -z-10" priority />
        )}
        <div className="absolute inset-0 bg-black/40 -z-10" />

        <div className="w-full px-margin-mobile md:px-margin-desktop pt-24 md:pt-28">
          <div className="max-w-container-max mx-auto w-full text-sm text-white/80 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-secondary hover:underline">Trang chủ</Link>
            <span>/</span>
            <Link href="/du-an" className="hover:text-secondary hover:underline">Dự án</Link>
            {project.category?.name && (
              <>
                <span>/</span>
                <Link href={`/du-an?category=${project.category.slug}`} className="hover:text-secondary hover:underline">
                  {project.category.name}
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="w-full px-margin-mobile md:px-margin-desktop pt-6 pb-8 md:pb-10">
          <div className="max-w-container-max mx-auto w-full">
            <h1 className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold text-white leading-snug break-words">
              {project.name}
            </h1>
          </div>
        </div>
      </div>

      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-sm">
          <div><span className="text-on-background/50">Khách hàng</span><p className="font-semibold">{project.client}</p></div>
          <div><span className="text-on-background/50">Địa điểm</span><p className="font-semibold">{project.location}</p></div>
          <div><span className="text-on-background/50">Năm thực hiện</span><p className="font-semibold">{project.year}</p></div>
        </div>

        {project.description && (
          <div className="rich-content max-w-3xl mb-12" dangerouslySetInnerHTML={{ __html: project.description }} />
        )}

        {project.materials?.length > 0 && (
          <div className="mb-12">
            <h2 className="font-heading text-2xl font-bold mb-6">Vật liệu sử dụng</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {project.materials.map((m, i) => (
                <div key={i} className="border border-on-background/10 rounded-xl overflow-hidden bg-white">
                  {m.image && (
                    <div className="relative w-full aspect-[4/3]">
                      <Image src={m.image} alt={m.name} fill className="object-cover" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-heading font-semibold mb-1">{m.name}</h3>
                    {m.description && <p className="text-sm text-on-background/60">{m.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {project.beforeAfterImages?.length > 0 && (
          <div className="mb-12">
            <h2 className="font-heading text-2xl font-bold mb-6">So sánh Trước & Sau</h2>
            <p className="text-sm text-on-background/50 mb-6">Kéo thanh trượt để xem sự khác biệt.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {project.beforeAfterImages.map((pair, i) => (
                <BeforeAfterSlider key={i} before={pair.before} after={pair.after} caption={pair.caption} />
              ))}
            </div>
          </div>
        )}

        {project.images?.length > 0 && (
          <div className="mb-12">
            {(() => {
              // ảnh cũ lưu dạng chuỗi thuần, ảnh mới có thể kèm chú thích — chuẩn hoá về cùng 1 dạng để hiển thị
              const gallery = project.images.map((img) => (typeof img === "string" ? { url: img, caption: "" } : img));
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gallery.map((img, i) => (
                    <div key={i}>
                      <ClickableImage
                        src={img.url}
                        alt={img.caption || project.name}
                        images={gallery.map((g) => ({ src: g.url, alt: g.caption || project.name }))}
                        index={i}
                        className="relative aspect-[4/3] rounded-xl overflow-hidden w-full"
                        imgClassName="object-cover"
                      />
                      {img.caption && <p className="text-sm text-on-background/60 mt-2">{img.caption}</p>}
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        <Link href="/du-an" className="text-sm font-semibold underline">← Xem tất cả dự án</Link>
      </div>
    </div>
  );
}
