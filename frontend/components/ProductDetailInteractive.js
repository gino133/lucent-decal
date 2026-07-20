"use client";
import { useState } from "react";
import ProductGallery from "./ProductGallery";
import ProductPurchasePanel from "./ProductPurchasePanel";

// nối ProductGallery và ProductPurchasePanel lại — khi khách chọn tuỳ chọn có ảnh riêng,
// ảnh lớn bên khung ảnh tự đổi theo luôn, không cần khách bấm thumbnail.
export default function ProductDetailInteractive({ product }) {
  const [variantImage, setVariantImage] = useState(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <ProductGallery images={product.images || []} name={product.name} overrideImage={variantImage} />
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

        <ProductPurchasePanel product={product} onVariantChange={(v) => setVariantImage(v?.image || null)} />

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
