import { getPage } from "@/lib/api";
import BlockRenderer from "@/components/BlockRenderer";
import { notFound } from "next/navigation";

// route bắt hết cho trang tự tạo ở /admin/trang, cho đường dẫn gọn /<slug>.
// Next.js ưu tiên route cố định trước nên không đụng gì các trang có sẵn.
export default async function CustomRootPage({ params }) {
  const page = await getPage(params.slug);
  if (!page) return notFound();

  return (
    <div className="pt-32 pb-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <h1 className="font-heading text-3xl md:text-4xl font-bold mb-10">{page.title}</h1>
      <BlockRenderer blocks={page.blocks} />
    </div>
  );
}
