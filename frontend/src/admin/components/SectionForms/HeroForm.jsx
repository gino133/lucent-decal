import React from 'react';
import { useFormContext } from 'react-hook-form';

const HeroForm = ({ index }) => {
  const { register } = useFormContext();

  return (
    <div className="space-y-4 border p-4 rounded bg-surface-container-low">
      <div>
        <label className="block font-bold text-sm">Tiêu đề lớn (Heading)</label>
        <input {...register(`sections.${index}.content.heading`)} className="w-full border p-2 rounded" placeholder="Nâng tầm không gian văn phòng với Decal nghệ thuật" />
      </div>
      <div>
        <label className="block font-bold text-sm">Mô tả (Subheading)</label>
        <textarea {...register(`sections.${index}.content.subheading`)} className="w-full border p-2 rounded" rows="3" placeholder="Kiến tạo môi trường làm việc hiện đại..." />
      </div>
      <div>
        <label className="block font-bold text-sm">URL ảnh nền</label>
        <input {...register(`sections.${index}.content.image`)} className="w-full border p-2 rounded" placeholder="https://..." />
      </div>
      <div>
        <label className="block font-bold text-sm">Nút bấm (mỗi dòng: label|variant)</label>
        <textarea {...register(`sections.${index}.content.buttonsText`)} className="w-full border p-2 rounded" rows="2" placeholder="Nhận tư vấn ngay|primary&#10;Xem bộ sưu tập|secondary" />
        <p className="text-xs text-on-surface-variant mt-1">Variant: primary (vàng), secondary (viền đen)</p>
      </div>
      <div>
        <label className="block font-bold text-sm">Màu nền</label>
        <input {...register(`sections.${index}.style.backgroundColor`)} className="w-full border p-2 rounded" placeholder="#fbf9f9" />
      </div>
    </div>
  );
};

export default HeroForm;