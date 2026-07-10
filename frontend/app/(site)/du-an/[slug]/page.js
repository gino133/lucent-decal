import Image from "next/image";
import Link from "next/link";
import { getProject } from "@/lib/api";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { notFound } from "next/navigation";

export default async function ProjectDetailPage({ params }) {
  const project = await getProject(params.slug);
  if (!project) return notFound();

  return (
    <div className="pt-32 pb-20">
      <div className="relative w-full aspect-[16/7] mb-10">
        {project.coverImage && <Image src={project.coverImage} alt={project.name} fill className="object-cover" priority />}
        <div className="absolute inset-0 bg-black/30 flex flex-col justify-between p-margin-mobile md:px-margin-desktop">
          <div className="max-w-container-max mx-auto w-full pt-24">
            <div className="text-sm text-white/80 flex items-center gap-1">
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
          <div className="max-w-container-max mx-auto w-full pb-10">
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-white">{project.name}</h1>
          </div>
        </div>
      </div>

      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="grid md:grid-cols-3 gap-6 mb-12 text-sm">
          <div><span className="text-on-background/50">Khách hàng</span><p className="font-semibold">{project.client}</p></div>
          <div><span className="text-on-background/50">Địa điểm</span><p className="font-semibold">{project.location}</p></div>
          <div><span className="text-on-background/50">Năm thực hiện</span><p className="font-semibold">{project.year}</p></div>
        </div>

        {project.description && (
          <div className="rich-content max-w-3xl mb-12" dangerouslySetInnerHTML={{ __html: project.description }} />
        )}

        {project.beforeAfterImages?.length > 0 && (
          <div className="mb-12">
            <h2 className="font-heading text-2xl font-bold mb-6">So sánh Trước & Sau</h2>
            <p className="text-sm text-on-background/50 mb-6">Kéo thanh trượt để xem sự khác biệt.</p>
            <div className="grid md:grid-cols-2 gap-8">
              {project.beforeAfterImages.map((pair, i) => (
                <BeforeAfterSlider key={i} before={pair.before} after={pair.after} caption={pair.caption} />
              ))}
            </div>
          </div>
        )}

        {project.images?.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4 mb-12">
            {project.images.map((img, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <Image src={img} alt="" fill className="object-cover" />
              </div>
            ))}
          </div>
        )}

        <Link href="/du-an" className="text-sm font-semibold underline">← Xem tất cả dự án</Link>
      </div>
    </div>
  );
}
