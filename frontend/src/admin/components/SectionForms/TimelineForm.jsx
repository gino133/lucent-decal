import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import LayoutControls from './LayoutControls';

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
          <div key={field.id} className="border p-2 my-2 rounded bg-surface">
            <div className="flex gap-2">
              <input {...register(`sections.${index}.content.events.${idx}.year`)} placeholder="Năm" className="w-24 border p-1 rounded" />
              <input {...register(`sections.${index}.content.events.${idx}.title`)} placeholder="Tiêu đề" className="flex-1 border p-1 rounded" />
              <button type="button" onClick={() => remove(idx)} className="bg-error text-white px-2 rounded">X</button>
            </div>
            <textarea {...register(`sections.${index}.content.events.${idx}.description`)} placeholder="Mô tả" className="w-full border p-1 rounded mt-1" rows="2" />
          </div>
        ))}
        <button type="button" onClick={() => append({ year: '', title: '', description: '' })} className="bg-secondary-fixed px-3 py-1 rounded text-sm">+ Thêm mốc</button>
      </div>
      <LayoutControls index={index} />
    </div>
  );
};

export default TimelineForm;