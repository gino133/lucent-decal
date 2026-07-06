import React from 'react';
import { useFormContext } from 'react-hook-form';
import LayoutControls from './LayoutControls';

const CTAForm = ({ index }) => {
  const { register } = useFormContext();

  return (
    <div className="space-y-4 border p-4 rounded bg-surface-container-low">
      <div>
        <label className="block font-bold text-sm">Tiêu đề</label>
        <input {...register(`sections.${index}.content.heading`)} className="w-full border p-2 rounded" placeholder="Bạn đã sẵn sàng để thay đổi không gian?" />
      </div>
      <div>
        <label className="block font-bold text-sm">Mô tả</label>
        <textarea {...register(`sections.${index}.content.subheading`)} className="w-full border p-2 rounded" rows="3" placeholder="Liên hệ ngay để nhận khảo sát miễn phí..." />
      </div>
      <div>
        <label className="block font-bold text-sm">Nút bấm (mỗi dòng: label|variant)</label>
        <textarea {...register(`sections.${index}.content.buttonsText`)} className="w-full border p-2 rounded" rows="2" placeholder="Nhận tư vấn ngay|primary&#10;Tải PDF báo giá|secondary" />
      </div>
      <LayoutControls index={index} />
    </div>
  );
};

export default CTAForm;