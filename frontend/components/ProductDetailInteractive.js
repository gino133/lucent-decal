"use client";
import { useMemo, useState } from "react";
import ProductGallery from "./ProductGallery";
import ProductPurchasePanel from "./ProductPurchasePanel";

// nối ProductGallery và ProductPurchasePanel lại, đồng bộ 2 CHIỀU:
// - bấm 1 tuỳ chọn (VD mã hàng "922-06") -> ảnh lớn đổi theo, đúng thumbnail đó
//   cũng được tô sáng, nếu biến thể đó có ảnh riêng.
// - bấm 1 ảnh thumbnail -> ảnh lớn đổi ngay lập tức; nếu đúng ảnh đó là ảnh riêng
//   của 1 biến thể nào thì tuỳ chọn tương ứng bên khung "Mã hàng" cũng tự chọn theo.
// activeImage là nguồn xác định duy nhất cho "ảnh lớn đang hiển thị + thumbnail nào
// đang được tô sáng" — cả 2 phía (chọn tuỳ chọn / chọn ảnh) đều ghi vào đây.
export default function ProductDetailInteractive({ product }) {
  const hasVariants = product.optionTypes?.length > 0 && product.variants?.length > 0;

  const [selected, setSelected] = useState(() =>
    hasVariants ? product.optionTypes.map((opt) => opt.values[0]) : []
  );

  const matchedVariant = useMemo(() => {
    if (!hasVariants) return null;
    return (
      product.variants.find(
        (v) => v.optionValues.length === selected.length && v.optionValues.every((val, i) => val === selected[i])
      ) || null
    );
  }, [selected, hasVariants, product.variants]);

  // khởi tạo ảnh đang hiển thị theo đúng biến thể được chọn sẵn ban đầu, để ngay từ
  // lúc tải trang thumbnail tô sáng và ảnh lớn đã khớp nhau, không cần đợi 1 lượt bấm
  const [activeImage, setActiveImage] = useState(() => matchedVariant?.image || null);

  function handleSelectedChange(nextSelected) {
    setSelected(nextSelected);
    const nextVariant = hasVariants
      ? product.variants.find(
          (v) => v.optionValues.length === nextSelected.length && v.optionValues.every((val, i) => val === nextSelected[i])
        )
      : null;
    setActiveImage(nextVariant?.image || null);
  }

  function handleThumbnailSelect(image) {
    setActiveImage(image); // ảnh lớn đổi ngay, bất kể có khớp biến thể nào hay không
    if (!hasVariants) return;
    const variant = product.variants.find((v) => v.image === image);
    if (variant) setSelected(variant.optionValues); // khớp biến thể thì chọn theo luôn
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <ProductGallery
        images={product.images || []}
        name={product.name}
        overrideImage={activeImage}
        onThumbnailSelect={handleThumbnailSelect}
      />
      <div>
        {product.category?.name && (
          <span className="text-xs uppercase tracking-widest text-secondary font-bold">{product.category.name}</span>
        )}
        <h1 className="font-heading text-3xl md:text-4xl font-bold mt-2 mb-4">{product.name}</h1>
        <p className="text-on-background/70 mb-6">{product.shortDescription}</p>
        {product.origin && (
          <p className="text-sm text-on-background/60 mb-6 -mt-4">
            Xuất xứ: <span className="font-medium text-on-background">{product.origin}</span>
          </p>
        )}

        <ProductPurchasePanel
          product={product}
          selected={selected}
          onSelectedChange={handleSelectedChange}
          matchedVariant={matchedVariant}
        />

        {product.specs?.length > 0 && (
          <div className="mt-10">
            <h3 className="font-heading font-semibold text-lg mb-3">Thông số kỹ thuật</h3>
            <table className="w-full text-sm">
              <tbody>
                {product.specs.map((s, i) => (
                  <tr key={i} className="border-b border-on-background/10">
                    <td className="py-2 text-on-background/60 w-1/3">{s.label}</td>
                    <td className="py-2 font-medium">{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
