import { getPage } from "@/lib/api";
import BlockRenderer from "@/components/BlockRenderer";
import { buildPageMetadata } from "@/lib/pageMetadata";

export const generateMetadata = () => buildPageMetadata({
  slug: "ho-so-nang-luc", path: "/ho-so-nang-luc", fallbackTitle: "Hồ sơ năng lực",
  fallbackDescription: "Hồ sơ năng lực thi công film dán nội thất: kinh nghiệm, dự án tiêu biểu và chứng nhận sản phẩm.",
});

export default async function ProfilePage() {
  const page = await getPage("ho-so-nang-luc");
  if (!page) return <div className="pt-40 text-center">Chưa có nội dung.</div>;
  return (
    <div className="pt-20">
      <BlockRenderer blocks={page.blocks} />
    </div>
  );
}
