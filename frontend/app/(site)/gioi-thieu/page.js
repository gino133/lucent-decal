import { getPage } from "@/lib/api";
import BlockRenderer from "@/components/BlockRenderer";
import { buildPageMetadata } from "@/lib/pageMetadata";

export const generateMetadata = () => buildPageMetadata({
  slug: "gioi-thieu", path: "/gioi-thieu", fallbackTitle: "Giới thiệu",
  fallbackDescription: "Giới thiệu về đơn vị cung cấp và thi công film dán nội thất tại TP.HCM: sản phẩm nhập khẩu chính hãng, quy trình rõ ràng, công trình thực tế.",
});

export default async function AboutPage() {
  const page = await getPage("gioi-thieu");
  if (!page) return <div className="pt-40 text-center">Chưa có nội dung.</div>;
  return (
    <div className="pt-20">
      <BlockRenderer blocks={page.blocks} />
    </div>
  );
}
