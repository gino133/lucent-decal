import { getPage } from "@/lib/api";
import BlockRenderer from "@/components/BlockRenderer";
import { notFound } from "next/navigation";

// Route "bắt tất cả" cho các trang tuỳ chỉnh tạo trong /admin/trang,
// cho phép truy cập bằng đường dẫn gọn /<slug> thay vì /trang/<slug>.
// Next.js luôn ưu tiên các route cố định (gioi-thieu, san-pham, du-an...)
// trước khi rơi vào route động này, nên không xung đột với các trang có sẵn.
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
