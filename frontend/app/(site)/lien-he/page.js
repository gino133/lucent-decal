import { getPage, getSettings } from "@/lib/api";
import BlockRenderer from "@/components/BlockRenderer";
import { buildPageMetadata } from "@/lib/pageMetadata";

export const generateMetadata = () => buildPageMetadata({
  slug: "lien-he", path: "/lien-he", fallbackTitle: "Liên hệ",
  fallbackDescription: "Liên hệ tư vấn và báo giá film dán nội thất, thi công tại TP.HCM. Gọi điện hoặc để lại thông tin, chúng tôi phản hồi nhanh.",
});

export default async function ContactPage() {
  const [page, settings] = await Promise.all([getPage("lien-he"), getSettings()]);
  return (
    <div className="pt-20">
      {page ? <BlockRenderer blocks={page.blocks} /> : (
        <h1 className="text-center font-heading text-3xl font-bold py-20">Liên hệ với chúng tôi</h1>
      )}

      <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-20 grid md:grid-cols-3 gap-6 text-center">
        <div className="p-6 rounded-xl bg-surface">
          <span className="material-symbols-outlined text-3xl text-secondary">call</span>
          <p className="mt-2 font-semibold">{settings?.contact?.phone}</p>
        </div>
        <div className="p-6 rounded-xl bg-surface">
          <span className="material-symbols-outlined text-3xl text-secondary">mail</span>
          <p className="mt-2 font-semibold">{settings?.contact?.email}</p>
        </div>
        <div className="p-6 rounded-xl bg-surface">
          <span className="material-symbols-outlined text-3xl text-secondary">location_on</span>
          <p className="mt-2 font-semibold">{settings?.contact?.address}</p>
        </div>
      </section>
    </div>
  );
}
