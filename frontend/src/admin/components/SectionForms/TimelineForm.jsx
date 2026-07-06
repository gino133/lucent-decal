import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';

const TimelineForm = ({ index }) => {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `sections.${index}.content.events`
  });

  return (
    <div className="space-y-4 border p-4 rounded bg-surface-container-low">
      <div>
        <label className="block font-bold text-sm">Tiêu đề</label>
        <input {...register(`sections.${index}.content.title`)} className="w-full border p-2 rounded" placeholder="Hành trình phát triển" />
      </div>
      <div>
        <label className="block font-bold text-sm">Các mốc thời gian</label>
        {fields.map((field, idx) => (
          <div key={field.id} className="border p-3 my-2 rounded bg-surface shadow-sm">
            <div className="grid grid-cols-1 gap-2">
              <div className="flex gap-2">
                <input {...register(`sections.${index}.content.events.${idx}.year`)} placeholder="Năm (ví dụ: 2010)" className="w-28 border p-1 rounded" />
                <input {...register(`sections.${index}.content.events.${idx}.title`)} placeholder="Tiêu đề sự kiện" className="flex-1 border p-1 rounded" />
                <button type="button" onClick={() => remove(idx)} className="bg-error text-white px-3 py-1 rounded hover:bg-red-700">X</button>
              </div>
              <textarea {...register(`sections.${index}.content.events.${idx}.description`)} placeholder="Mô tả" className="w-full border p-1 rounded" rows="2" />
            </div>
          </div>
        ))}
        <button type="button" onClick={() => append({ year: '', title: '', description: '' })} className="bg-secondary-fixed px-3 py-1 rounded text-sm hover:opacity-80">
          + Thêm mốc
        </button>
      </div>
      <div>
        <label className="block font-bold text-sm">Màu nền</label>
        <input {...register(`sections.${index}.style.backgroundColor`)} className="w-full border p-2 rounded" placeholder="#fbf9f9" />
      </div>
    </div>
  );
};

export default TimelineForm;