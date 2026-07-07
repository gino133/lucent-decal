import { getPage } from "@/lib/api";
import BlockRenderer from "@/components/BlockRenderer";

export default async function ProfilePage() {
  const page = await getPage("ho-so-nang-luc");
  if (!page) return <div className="pt-40 text-center">Chưa có nội dung.</div>;
  return (
    <div className="pt-20">
      <BlockRenderer blocks={page.blocks} />
    </div>
  );
}
