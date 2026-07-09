"use client";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";

export default function Navbar({ settings, menu }) {
  const [open, setOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const { totalQuantity } = useCart();
  const items = menu?.items?.sort((a, b) => a.order - b.order) || [];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-on-background/10">
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
        <Link href="/" className="font-heading font-bold text-xl md:text-2xl tracking-tight">
          {settings?.siteName || "Lucent Glass"}
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          {items.map((item) => {
            const hasChildren = item.children?.length > 0;
            return (
              <div key={item._id || item.url} className="relative group">
                <Link
                  href={item.url}
                  className="flex items-center gap-1 font-body text-sm font-semibold tracking-wide text-on-background/80 hover:text-secondary transition-colors py-2"
                >
                  {item.label}
                  {hasChildren && <span className="material-symbols-outlined text-base">expand_more</span>}
                </Link>

                {hasChildren && (
                  <div className="absolute left-0 top-full pt-1 hidden group-hover:block">
                    <div className="bg-background border border-on-background/10 rounded-xl shadow-lg py-2 min-w-[200px]">
                      {item.children
                        .slice()
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .map((child) => (
                          <Link
                            key={child.url}
                            href={child.url}
                            className="block px-4 py-2 text-sm font-medium hover:bg-surface hover:text-secondary transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/gio-hang" className="relative">
            <span className="material-symbols-outlined align-middle">shopping_cart</span>
            {totalQuantity > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary text-on-background text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalQuantity}
              </span>
            )}
          </Link>
          <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            <span className="material-symbols-outlined">{open ? "close" : "menu"}</span>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden flex flex-col px-margin-mobile pb-6 space-y-1 bg-background border-t border-on-background/10">
          {items.map((item) => {
            const hasChildren = item.children?.length > 0;
            const expanded = mobileExpanded === (item._id || item.url);
            return (
              <div key={item._id || item.url}>
                <div className="flex items-center justify-between">
                  <Link
                    href={item.url}
                    onClick={() => setOpen(false)}
                    className="font-body text-base font-semibold py-3 flex-1"
                  >
                    {item.label}
                  </Link>
                  {hasChildren && (
                    <button
                      onClick={() => setMobileExpanded(expanded ? null : item._id || item.url)}
                      className="p-3"
                      aria-label="Mở menu con"
                    >
                      <span className="material-symbols-outlined">{expanded ? "expand_less" : "expand_more"}</span>
                    </button>
                  )}
                </div>
                {hasChildren && expanded && (
                  <div className="pl-4 pb-2 space-y-1 border-l border-on-background/10 ml-1">
                    {item.children
                      .slice()
                      .sort((a, b) => (a.order || 0) - (b.order || 0))
                      .map((child) => (
                        <Link
                          key={child.url}
                          href={child.url}
                          onClick={() => setOpen(false)}
                          className="block font-body text-sm py-2 text-on-background/70"
                        >
                          {child.label}
                        </Link>
                      ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </nav>
  );
}
