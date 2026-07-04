// frontend/src/admin/components/SectionForms/ProjectGridForm.jsx
import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';

const ProjectGridForm = ({ index }) => {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `sections.${index}.content.projects`
  });

  return (
    <div className="space-y-4 border p-4 rounded bg-surface-container-low">
      <div>
        <label className="block font-bold text-sm">Tiêu đề</label>
        <input {...register(`sections.${index}.content.title`)} className="w-full border p-2 rounded" placeholder="Dự án tiêu biểu" />
      </div>
      <div>
        <label className="block font-bold text-sm">Mô tả</label>
        <input {...register(`sections.${index}.content.subtitle`)} className="w-full border p-2 rounded" placeholder="Khám phá cách chúng tôi thay đổi..." />
      </div>
      <div>
        <label className="block font-bold text-sm">Link xem tất cả</label>
        <input {...register(`sections.${index}.content.viewAllLink`)} className="w-full border p-2 rounded" placeholder="/du-an" />
      </div>
      <div>
        <label className="block font-bold text-sm">Danh sách dự án</label>
        {fields.map((field, idx) => (
          <div key={field.id} className="border p-2 my-2 rounded bg-surface">
            <div className="flex gap-2">
              <input {...register(`sections.${index}.content.projects.${idx}.name`)} placeholder="Tên dự án" className="flex-1 border p-1 rounded" />
              <input {...register(`sections.${index}.content.projects.${idx}.category`)} placeholder="Danh mục" className="flex-1 border p-1 rounded" />
              <button type="button" onClick={() => remove(idx)} className="bg-error text-white px-2 rounded">X</button>
            </div>
            <input {...register(`sections.${index}.content.projects.${idx}.description`)} placeholder="Mô tả" className="w-full border p-1 rounded mt-1" />
            <input {...register(`sections.${index}.content.projects.${idx}.image`)} placeholder="URL ảnh" className="w-full border p-1 rounded mt-1" />
          </div>
        ))}
        <button type="button" onClick={() => append({ name: '', category: '', description: '', image: '' })} className="bg-secondary-fixed px-3 py-1 rounded text-sm">+ Thêm dự án</button>
      </div>
      <div>
        <label className="block font-bold text-sm">Màu nền</label>
        <input {...register(`sections.${index}.style.backgroundColor`)} className="w-full border p-2 rounded" placeholder="#fbf9f9" />
      </div>
    </div>
  );
};

export default ProjectGridForm;