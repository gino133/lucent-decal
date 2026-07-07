import Link from "next/link";

export default function Footer({ settings, footerMenu }) {
  const items = footerMenu?.items?.sort((a, b) => a.order - b.order) || [];

  return (
    <footer className="w-full py-16 px-margin-mobile md:px-margin-desktop bg-surface border-t border-on-background/10 mt-24">
      <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-4 gap-gutter">
        <div>
          <div className="font-heading text-lg font-bold mb-4 uppercase">{settings?.siteName || "Lucent Glass"}</div>
          <p className="text-sm text-on-background/70 mb-4">{settings?.tagline}</p>
          <div className="flex space-x-4 text-on-background/70">
            {settings?.social?.facebook && (
              <a href={settings.social.facebook} target="_blank" rel="noreferrer"><span className="material-symbols-outlined">public</span></a>
            )}
            {settings?.contact?.email && (
              <a href={`mailto:${settings.contact.email}`}><span className="material-symbols-outlined">mail</span></a>
            )}
            {settings?.contact?.phone && (
              <a href={`tel:${settings.contact.phone}`}><span className="material-symbols-outlined">phone</span></a>
            )}
          </div>
        </div>

        {items.map((group) => (
          <div key={group._id || group.label}>
            <h4 className="font-body text-sm font-bold mb-4 uppercase tracking-wider">{group.label}</h4>
            <ul className="space-y-3">
              {group.children?.map((child) => (
                <li key={child.url}>
                  <Link href={child.url} className="text-sm text-on-background/70 hover:text-secondary transition-colors">
                    {child.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="font-body text-sm font-bold mb-4 uppercase tracking-wider">Liên hệ</h4>
          <p className="text-sm text-on-background/70 mb-2">{settings?.contact?.address}</p>
          <p className="text-sm text-on-background/70 mb-2">{settings?.contact?.phone}</p>
          <p className="text-sm text-on-background/70">{settings?.contact?.email}</p>
        </div>
      </div>

      <div className="max-w-container-max mx-auto mt-12 pt-6 border-t border-on-background/5 text-sm text-on-background/60 text-center">
        {settings?.footerText}
      </div>
    </footer>
  );
}
