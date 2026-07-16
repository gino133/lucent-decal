"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart-context";

export default function Navbar({ settings, menu }) {
  const [open, setOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const { totalQuantity } = useCart();
  const items = menu?.items?.sort((a, b) => a.order - b.order) || [];
  const drawerRef = useRef(null);

  // bấm ra ngoài drawer thì tự đóng, khỏi cần bấm nút X
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e) {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [open]);

  // khoá cuộn nền khi drawer đang mở
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // đóng drawer thì menu con cũng đóng theo luôn, lần sau mở lại là về trạng thái ban đầu
  useEffect(() => {
    if (!open) setMobileExpanded(null);
  }, [open]);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-on-background/10">
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
        <Link href="/" className="shrink-0 flex items-center">
          {settings?.brandDisplayMode === "logo" && settings?.logoUrl ? (
            <span className="relative h-9 md:h-11 w-auto" style={{ aspectRatio: "auto" }}>
              <Image
                src={settings.logoUrl}
                alt={settings?.siteName || "Logo"}
                height={44}
                width={160}
                className="h-9 md:h-11 w-auto object-contain"
                priority
              />
            </span>
          ) : (
            <span className="font-heading font-bold text-xl md:text-2xl tracking-tight">
              {settings?.siteName || "Website"}
            </span>
          )}
        </Link>

        {/* Menu ngang đầy đủ — chỉ hiện từ desktop rộng (lg) trở lên để tránh tràn dòng ở tablet */}
        <div className="hidden lg:flex items-center gap-1">
          {items.map((item) => {
            const hasChildren = item.children?.length > 0;
            return (
              <div key={item._id || item.url} className="relative group">
                <Link
                  href={item.url}
                  className="flex items-center gap-1 -mx-1 px-4 py-3 rounded-lg font-body text-sm font-semibold tracking-wide text-on-background/80 hover:text-secondary hover:bg-surface/60 transition-colors"
                >
                  {item.label}
                  {hasChildren && <span className="material-symbols-outlined text-base">expand_more</span>}
                </Link>

                {hasChildren && (
                  <div className="absolute left-0 top-full pt-1 hidden group-hover:block">
                    <div className="bg-background border border-on-background/10 rounded-xl shadow-lg py-2 min-w-[220px]">
                      {item.children
                        .slice()
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .map((child) => (
                          <Link
                            key={child.url}
                            href={child.url}
                            className="block px-4 py-2.5 text-sm font-medium hover:bg-surface hover:text-secondary transition-colors"
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

        <div className="flex items-center gap-2">
          <Link href="/gio-hang" className="relative p-2 -m-2" aria-label="Giỏ hàng">
            <span className="material-symbols-outlined align-middle">shopping_cart</span>
            {totalQuantity > 0 && (
              <span className="absolute top-0 right-0 bg-secondary text-on-background text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalQuantity}
              </span>
            )}
          </Link>
          {/* Nút mở menu — hiện ở cả mobile lẫn tablet (dưới lg) */}
          <button className="lg:hidden p-2 -m-1" onClick={() => setOpen(true)} aria-label="Mở menu">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>

      {/* Nền mờ phía sau drawer */}
      {open && <div className="lg:hidden fixed inset-0 z-40 bg-black/50" aria-hidden="true" />}

      {/* Drawer menu trượt từ bên phải — dùng chung cho cả mobile và tablet */}
      <div
        ref={drawerRef}
        className={`lg:hidden fixed top-0 right-0 h-[100dvh] w-80 max-w-[85vw] z-50 bg-background shadow-2xl
          transition-transform duration-300 ease-in-out overflow-y-auto overscroll-contain
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-on-background/10">
          <span className="font-heading font-bold text-lg">Menu</span>
          <button onClick={() => setOpen(false)} className="p-2 -m-2" aria-label="Đóng menu">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex flex-col px-4 py-4">
          {items.map((item) => {
            const hasChildren = item.children?.length > 0;
            const expanded = mobileExpanded === (item._id || item.url);
            return (
              <div key={item._id || item.url}>
                <div className="flex items-center justify-between">
                  <Link
                    href={item.url}
                    onClick={() => setOpen(false)}
                    className="font-body text-base font-semibold py-3.5 px-2 flex-1 rounded-lg hover:bg-surface"
                  >
                    {item.label}
                  </Link>
                  {hasChildren && (
                    <button
                      onClick={() => setMobileExpanded(expanded ? null : item._id || item.url)}
                      className="p-3.5 -m-1 rounded-lg hover:bg-surface"
                      aria-label="Mở menu con"
                    >
                      <span className="material-symbols-outlined">{expanded ? "expand_less" : "expand_more"}</span>
                    </button>
                  )}
                </div>
                {hasChildren && expanded && (
                  <div className="pl-4 pb-2 space-y-1 border-l border-on-background/10 ml-3">
                    {item.children
                      .slice()
                      .sort((a, b) => (a.order || 0) - (b.order || 0))
                      .map((child) => (
                        <Link
                          key={child.url}
                          href={child.url}
                          onClick={() => setOpen(false)}
                          className="block font-body text-sm py-2.5 px-3 -mx-3 rounded-lg text-on-background/70 hover:bg-surface"
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
      </div>
    </nav>
  );
}
