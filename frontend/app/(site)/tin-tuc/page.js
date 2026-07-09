import Link from "next/link";
import { getPosts, getCategories } from "@/lib/api";
import PostCard from "@/components/PostCard";

export default async function BlogListPage({ searchParams }) {
  const category = searchParams?.category || "";
  const page = Number(searchParams?.page || 1);
  const qs = new URLSearchParams({ page, limit: 9, ...(category ? { category } : {}) }).toString();

  const [res, categories] = await Promise.all([
    getPosts(`?${qs}`),
    getCategories("post"),
  ]);
  const posts = res?.items || [];

  return (
    <div className="pt-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-20">
      <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Tin tức</h1>
      <p className="text-on-background/60 mb-8">Cập nhật thông tin, kiến thức và dự án mới nhất từ Lucent Glass.</p>

      {categories?.length > 0 && (
        <div className="flex gap-3 flex-wrap mb-10">
          <Link
            href="/tin-tuc"
            className={`px-4 py-2 rounded-full text-sm font-semibold border ${!category ? "bg-secondary border-secondary" : "border-on-background/20"}`}
          >
            Tất cả
          </Link>
          {categories.map((c) => (
            <Link
              key={c._id}
              href={`/tin-tuc?category=${c.slug}`}
              className={`px-4 py-2 rounded-full text-sm font-semibold border ${category === c.slug ? "bg-secondary border-secondary" : "border-on-background/20"}`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}

      {posts.length === 0 ? (
        <p className="text-on-background/50 text-center py-20">Chưa có bài viết nào.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((p) => <PostCard key={p._id} post={p} />)}
        </div>
      )}

      {res?.pages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: res.pages }, (_, i) => (
            <Link
              key={i}
              href={`/tin-tuc?page=${i + 1}${category ? `&category=${category}` : ""}`}
              className={`w-9 h-9 flex items-center justify-center rounded-full border text-sm ${page === i + 1 ? "bg-secondary border-secondary" : "border-on-background/20"}`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
