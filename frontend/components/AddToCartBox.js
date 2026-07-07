"use client";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import Link from "next/link";

export default function AddToCartBox({ product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center border border-on-background/20 rounded-lg">
        <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-3">−</button>
        <span className="px-4 font-semibold">{qty}</span>
        <button onClick={() => setQty((q) => q + 1)} className="px-4 py-3">+</button>
      </div>
      <button onClick={handleAdd} className="btn-primary flex-1 rounded-lg py-3 font-semibold lemon-glow">
        {added ? "Đã thêm vào giỏ ✓" : "Thêm vào giỏ hàng"}
      </button>
      {added && (
        <Link href="/gio-hang" className="text-sm font-semibold underline whitespace-nowrap">
          Xem giỏ hàng
        </Link>
      )}
    </div>
  );
}
