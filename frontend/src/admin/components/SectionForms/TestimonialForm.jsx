import React from 'react';
import { useFormContext } from 'react-hook-form';

const TestimonialForm = ({ index }) => {
  const { register } = useFormContext();

  return (
    <div className="space-y-4 border p-4 rounded bg-surface-container-low">
      <div>
        <label className="block font-bold text-sm">Nội dung trích dẫn</label>
        <textarea {...register(`sections.${index}.content.quote`)} className="w-full border p-2 rounded" rows="3" placeholder='"GLAZED không chỉ cung cấp decal, họ mang đến một ngôn ngữ thiết kế hoàn toàn mới..."' />
      </div>
      <div>
        <label className="block font-bold text-sm">Tác giả</label>
        <input {...register(`sections.${index}.content.author`)} className="w-full border p-2 rounded" placeholder="Nguyễn Phương Linh" />
      </div>
      <div>
        <label className="block font-bold text-sm">Vai trò</label>
        <input {...register(`sections.${index}.content.role`)} className="w-full border p-2 rounded" placeholder="Giám đốc Vận hành" />
      </div>
      <div>
        <label className="block font-bold text-sm">URL ảnh đại diện</label>
        <input {...register(`sections.${index}.content.avatar`)} className="w-full border p-2 rounded" placeholder="https://..." />
      </div>
      <div>
        <label className="block font-bold text-sm">Màu nền</label>
        <input {...register(`sections.${index}.style.backgroundColor`)} className="w-full border p-2 rounded" placeholder="#fbf9f9" />
      </div>
    </div>
  );
};

export default TestimonialForm;