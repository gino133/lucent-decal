import Link from "next/link";
import Image from "next/image";

export default function ProjectCard({ project, size = "normal" }) {
  return (
    <Link
      href={`/du-an/${project.slug}`}
      className={`group relative block overflow-hidden rounded-xl ${size === "large" ? "aspect-[16/10]" : "aspect-[4/3]"}`}
    >
      {project.coverImage && (
        <Image
          src={project.coverImage}
          alt={project.name}
          fill
          sizes="(max-width:768px) 100vw, 50vw"
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
      )}
      <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
        {project.category?.name && (
          <span className="text-xs uppercase tracking-widest text-secondary font-bold block mb-1">
            {project.category.name}
          </span>
        )}
        <h3 className="font-heading text-white text-lg md:text-xl font-semibold">{project.name}</h3>
      </div>
    </Link>
  );
}
