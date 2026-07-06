// frontend/src/admin/components/SectionForms/LayoutControls.jsx
import React from 'react';
import { useFormContext } from 'react-hook-form';

const LayoutControls = ({ index }) => {
  const { register } = useFormContext();

  return (
    <div className="border-t pt-4 mt-4">
      <h4 className="font-bold text-sm mb-3">Bố cục & Style</h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm">Max Width (px hoặc %)</label>
          <input {...register(`sections.${index}.style.maxWidth`)} className="w-full border p-1 rounded" placeholder="1280px" />
        </div>
        <div>
          <label className="block text-sm">Text Align</label>
          <select {...register(`sections.${index}.style.textAlign`)} className="w-full border p-1 rounded">
            <option value="left">Trái</option>
            <option value="center">Giữa</option>
            <option value="right">Phải</option>
          </select>
        </div>
        <div>
          <label className="block text-sm">Padding Top (px)</label>
          <input {...register(`sections.${index}.style.paddingTop`)} type="number" className="w-full border p-1 rounded" placeholder="0" />
        </div>
        <div>
          <label className="block text-sm">Padding Bottom (px)</label>
          <input {...register(`sections.${index}.style.paddingBottom`)} type="number" className="w-full border p-1 rounded" placeholder="0" />
        </div>
        <div>
          <label className="block text-sm">Margin Top (px)</label>
          <input {...register(`sections.${index}.style.marginTop`)} type="number" className="w-full border p-1 rounded" placeholder="0" />
        </div>
        <div>
          <label className="block text-sm">Margin Bottom (px)</label>
          <input {...register(`sections.${index}.style.marginBottom`)} type="number" className="w-full border p-1 rounded" placeholder="0" />
        </div>
        <div className="col-span-2">
          <label className="block text-sm">Màu nền</label>
          <input {...register(`sections.${index}.style.backgroundColor`)} type="color" className="w-full h-10 p-1 rounded border" />
        </div>
        <div className="col-span-2">
          <label className="block text-sm">URL ảnh nền</label>
          <input {...register(`sections.${index}.style.backgroundImage`)} className="w-full border p-1 rounded" placeholder="https://..." />
        </div>
      </div>
    </div>
  );
};

export default LayoutControls;