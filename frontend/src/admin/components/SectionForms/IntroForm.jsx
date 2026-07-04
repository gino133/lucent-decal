// frontend/src/admin/components/SectionForms/IntroForm.jsx
import React from 'react';
import { useFormContext } from 'react-hook-form';

const IntroForm = ({ index }) => {
  const { register } = useFormContext();

  return (
    <div className="space-y-4 border p-4 rounded bg-surface-container-low">
      <div>
        <label className="block font-bold text-sm">Tiêu đề</label>
        <input {...register(`sections.${index}.content.heading`)} className="w-full border p-2 rounded" placeholder="Độ chính xác trong từng milimet" />
      </div>
      <div>
        <label className="block font-bold text-sm">Nội dung</label>
        <textarea {...register(`sections.${index}.content.text`)} className="w-full border p-2 rounded" rows="4" placeholder="Tại Lucent Glass, chúng tôi..." />
      </div>
      <div>
        <label className="block font-bold text-sm">URL ảnh 1</label>
        <input {...register(`sections.${index}.content.image1`)} className="w-full border p-2 rounded" placeholder="https://..." />
      </div>
      <div>
        <label className="block font-bold text-sm">URL ảnh 2</label>
        <input {...register(`sections.${index}.content.image2`)} className="w-full border p-2 rounded" placeholder="https://..." />
      </div>
      <div>
        <label className="block font-bold text-sm">Thống kê (mỗi dòng: value|label)</label>
        <textarea {...register(`sections.${index}.content.statsText`)} className="w-full border p-2 rounded" rows="2" placeholder="12+|Năm kinh nghiệm&#10;500+|Dự án hoàn thành" />
      </div>
      <div>
        <label className="block font-bold text-sm">Màu nền</label>
        <input {...register(`sections.${index}.style.backgroundColor`)} className="w-full border p-2 rounded" placeholder="#fbf9f9" />
      </div>
    </div>
  );
};

export default IntroForm;