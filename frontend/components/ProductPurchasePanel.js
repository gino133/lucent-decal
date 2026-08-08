"use client";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

// hiện giá + bộ chọn tuỳ chọn (nếu có) rồi thêm vào giỏ, sản phẩm không có
// biến thể thì y như ô mua hàng đơn giản bình thường.
// selected/matchedVariant do component cha (ProductDetailInteractive) quản lý và
// truyền xuống, để đồng bộ 2 chiều được với việc bấm chọn ảnh thumbnail bên khung ảnh.
export default function ProductPurchasePanel({ product, selected, onSelectedChange, matchedVariant }) {
  const { addItem } = useCart();
  const hasVariants = product.optionTypes?.length > 0 && product.variants?.length > 0;

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const displayPrice = hasVariants ? matchedVariant?.price ?? product.price : product.price;
  const canAdd = !hasVariants || !!matchedVariant;

  function selectValue(optIdx, value) {
    const next = [...selected];
    next[optIdx] = value;
    onSelectedChange(next);
  }

  function handleAdd() {
    if (!canAdd) return;
    const variantLabel = hasVariants
      ? product.optionTypes.map((opt, i) => `${opt.name}: ${selected[i]}`).join(" | ")
      : "";
    const priceToUse = hasVariants ? matchedVariant.price : product.price;
    addItem({ ...product, price: priceToUse }, qty, variantLabel);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div>
      <div className="text-2xl font-bold mb-6">
        {displayPrice?.toLocaleString("vi-VN")}đ
        {!hasVariants && product.unit && <span className="text-sm font-normal text-on-background/50"> / {product.unit}</span>}
      </div>

      {hasVariants && (
        <div className="space-y-4 mb-6">
          {product.optionTypes.map((opt, optIdx) => (
            <div key={opt.name}>
              <p className="text-sm font-semibold mb-2">{opt.name}</p>
              <div className="flex flex-wrap gap-2">
                {opt.values.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => selectValue(optIdx, val)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      selected[optIdx] === val
                        ? "bg-secondary border-secondary"
                        : "border-on-background/20 hover:border-on-background/40"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {!matchedVariant && (
            <p className="text-sm text-red-500">Tổ hợp này hiện chưa có giá, vui lòng chọn tuỳ chọn khác.</p>
          )}
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="flex items-center border border-on-background/20 rounded-lg">
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-3">−</button>
          <span className="px-4 font-semibold">{qty}</span>
          <button type="button" onClick={() => setQty((q) => q + 1)} className="px-4 py-3">+</button>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!canAdd}
          className="btn-primary flex-1 rounded-lg py-3 font-semibold lemon-glow disabled:opacity-50"
        >
          {added ? "Đã thêm vào giỏ ✓" : "Thêm vào giỏ hàng"}
        </button>
        {added && (
          <Link href="/gio-hang" className="text-sm font-semibold underline whitespace-nowrap">
            Xem giỏ hàng
          </Link>
        )}
      </div>
    </div>
  );
}
