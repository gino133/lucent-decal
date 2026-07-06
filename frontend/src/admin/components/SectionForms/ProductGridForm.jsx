import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';

const ProductGridForm = ({ index }) => {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `sections.${index}.content.products`
  });

  return (
    <div className="space-y-4 border p-4 rounded bg-surface-container-low">
      <div>
        <label className="block font-bold text-sm">Tiêu đề</label>
        <input {...register(`sections.${index}.content.title`)} className="w-full border p-2 rounded" placeholder="Sản Phẩm Mới Nhất" />
      </div>
      <div>
        <label className="block font-bold text-sm">Mô tả</label>
        <input {...register(`sections.${index}.content.subtitle`)} className="w-full border p-2 rounded" placeholder="Những mẫu thiết kế được ưa chuộng nhất..." />
      </div>
      <div>
        <label className="block font-bold text-sm">Link xem tất cả</label>
        <input {...register(`sections.${index}.content.viewAllLink`)} className="w-full border p-2 rounded" placeholder="/san-pham" />
      </div>
      <div>
        <label className="block font-bold text-sm">Danh sách sản phẩm</label>
        {fields.map((field, idx) => (
          <div key={field.id} className="border p-3 my-2 rounded bg-surface shadow-sm">
            <div className="grid grid-cols-1 gap-2">
              <div className="flex gap-2">
                <input {...register(`sections.${index}.content.products.${idx}.name`)} placeholder="Tên sản phẩm" className="flex-1 border p-1 rounded" />
                <input {...register(`sections.${index}.content.products.${idx}.price`)} placeholder="Giá (ví dụ: 450.000đ / m²)" className="flex-1 border p-1 rounded" />
                <button type="button" onClick={() => remove(idx)} className="bg-error text-white px-3 py-1 rounded hover:bg-red-700">X</button>
              </div>
              <input {...register(`sections.${index}.content.products.${idx}.description`)} placeholder="Mô tả ngắn" className="w-full border p-1 rounded" />
              <input {...register(`sections.${index}.content.products.${idx}.image`)} placeholder="URL ảnh" className="w-full border p-1 rounded" />
              <input {...register(`sections.${index}.content.products.${idx}.badge`)} placeholder="Badge (Mới, Bán chạy...)" className="w-full border p-1 rounded" />
            </div>
          </div>
        ))}
        <button type="button" onClick={() => append({ name: '', price: '', description: '', image: '', badge: '' })} className="bg-secondary-fixed px-3 py-1 rounded text-sm hover:opacity-80">
          + Thêm sản phẩm
        </button>
      </div>
      <div>
        <label className="block font-bold text-sm">Màu nền</label>
        <input {...register(`sections.${index}.style.backgroundColor`)} className="w-full border p-2 rounded" placeholder="#fbf9f9" />
      </div>
    </div>
  );
};

export default ProductGridForm;