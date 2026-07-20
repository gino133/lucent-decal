import Link from "next/link";
import { getProjects, getCategories } from "@/lib/api";
import ProjectCard from "@/components/ProjectCard";
import CategoryScrollBar from "@/components/CategoryScrollBar";

export default async function ProjectsPage({ searchParams }) {
  const category = searchParams?.category || "";
  const qs = new URLSearchParams({ limit: 12, ...(category ? { category } : {}) }).toString();
  const [res, categories] = await Promise.all([getProjects(`?${qs}`), getCategories("project")]);
  const projects = res?.items || [];

  return (
    <div className="pt-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-20">
      <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Dự án</h1>
      <p className="text-on-background/60 mb-8">Những công trình tiêu biểu đã thực hiện.</p>

      <CategoryScrollBar categories={categories} basePath="/du-an" activeSlug={category} />

      {projects.length === 0 ? (
        <p className="text-on-background/50 text-center py-20">Chưa có dự án nào.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p, i) => <ProjectCard key={p._id} project={p} size={i === 0 ? "large" : "normal"} />)}
        </div>
      )}
    </div>
  );
}
