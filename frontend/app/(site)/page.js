import { getPage } from "@/lib/api";
import BlockRenderer from "@/components/BlockRenderer";

export default async function HomePage() {
  const page = await getPage("home");

  if (!page) {
    return (
      <div className="pt-40 text-center px-margin-mobile">
        <h1 className="font-heading text-3xl font-bold mb-4">Chào mừng đến với Lucent Glass</h1>
        <p className="text-on-background/60">
          Chưa có nội dung trang chủ. Vào <code>/admin</code> để thiết lập nội dung.
        </p>
      </div>
    );
  }

  return <BlockRenderer blocks={page.blocks} />;
}
