// frontend/src/admin/components/SectionForms/StatsForm.jsx
import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';

const StatsForm = ({ index }) => {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `sections.${index}.content.stats`
  });

  return (
    <div className="space-y-4 border p-4 rounded bg-surface-container-low">
      <div>
        <label className="block font-bold text-sm">Tiêu đề</label>
        <input {...register(`sections.${index}.content.title`)} className="w-full border p-2 rounded" placeholder="Thành tựu của chúng tôi" />
      </div>
      <div>
        <label className="block font-bold text-sm">Các chỉ số</label>
        {fields.map((field, idx) => (
          <div key={field.id} className="flex gap-2 items-center border p-2 my-1 rounded bg-surface">
            <input {...register(`sections.${index}.content.stats.${idx}.value`)} placeholder="Giá trị (ví dụ: 150+)" className="flex-1 border p-1 rounded" />
            <input {...register(`sections.${index}.content.stats.${idx}.label`)} placeholder="Nhãn (ví dụ: Dự án)" className="flex-1 border p-1 rounded" />
            <button type="button" onClick={() => remove(idx)} className="bg-error text-white px-2 rounded">X</button>
          </div>
        ))}
        <button type="button" onClick={() => append({ value: '', label: '' })} className="bg-secondary-fixed px-3 py-1 rounded text-sm">+ Thêm chỉ số</button>
      </div>
      <div>
        <label className="block font-bold text-sm">Màu nền</label>
        <input {...register(`sections.${index}.style.backgroundColor`)} className="w-full border p-2 rounded" placeholder="#fbf9f9" />
      </div>
    </div>
  );
};

export default StatsForm;