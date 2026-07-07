"use client";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";

export default function Navbar({ settings, menu }) {
  const [open, setOpen] = useState(false);
  const { totalQuantity } = useCart();
  const items = menu?.items?.sort((a, b) => a.order - b.order) || [];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-on-background/10">
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
        <Link href="/" className="font-heading font-bold text-xl md:text-2xl tracking-tight">
          {settings?.siteName || "Lucent Glass"}
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          {items.map((item) => (
            <Link
              key={item._id || item.url}
              href={item.url}
              className="font-body text-sm font-semibold tracking-wide text-on-background/80 hover:text-secondary transition-colors"
            >
              {item.label}
            </Link>
          ))}
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
        <div className="md:hidden flex flex-col px-margin-mobile pb-6 space-y-4 bg-background border-t border-on-background/10">
          {items.map((item) => (
            <Link
              key={item._id || item.url}
              href={item.url}
              onClick={() => setOpen(false)}
              className="font-body text-base font-semibold py-2"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
