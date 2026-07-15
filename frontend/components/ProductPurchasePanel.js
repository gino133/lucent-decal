"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

// hiện giá + bộ chọn tuỳ chọn (nếu có) rồi thêm vào giỏ, sản phẩm không có
// biến thể thì y như ô mua hàng đơn giản bình thường
export default function ProductPurchasePanel({ product, onVariantChange }) {
  const { addItem } = useCart();
  const hasVariants = product.optionTypes?.length > 0 && product.variants?.length > 0;

  // chọn sẵn giá trị đầu của mỗi tuỳ chọn để có giá hiện ngay, khỏi chờ
  const [selected, setSelected] = useState(() =>
    hasVariants ? product.optionTypes.map((opt) => opt.values[0]) : []
  );
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const matchedVariant = useMemo(() => {
    if (!hasVariants) return null;
    return (
      product.variants.find(
        (v) => v.optionValues.length === selected.length && v.optionValues.every((val, i) => val === selected[i])
      ) || null
    );
  }, [selected, hasVariants, product.variants]);

  const displayPrice = hasVariants ? matchedVariant?.price ?? product.price : product.price;
  const canAdd = !hasVariants || !!matchedVariant;

  // báo lên ngoài mỗi khi biến thể đang chọn đổi, để ảnh lớn tự đổi theo nếu biến thể có ảnh riêng
  useEffect(() => {
    onVariantChange?.(matchedVariant);
  }, [matchedVariant]);

  function selectValue(optIdx, value) {
    setSelected((prev) => {
      const next = [...prev];
      next[optIdx] = value;
      return next;
    });
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
