// frontend/src/admin/PageEditor.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { getPage, savePage } from '../services/api';
import SectionEditor from './components/SectionEditor';

const PageEditor = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const methods = useForm({
    defaultValues: { slug: '', title: '', sections: [] }
  });
  const { register, handleSubmit, setValue, control } = methods;
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'sections'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (slug) {
      getPage(slug)
        .then(res => {
          const data = res.data;
          setValue('slug', data.slug);
          setValue('title', data.title);
          setValue('sections', data.sections || []);
        })
        .catch(() => {});
    }
  }, [slug, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Xử lý chuyển đổi dữ liệu từ form sang cấu trúc JSON đúng
      const formattedSections = data.sections.map((sec, idx) => {
        const newSec = {
          type: sec.type,
          order: sec.order || idx,
          content: { ...sec.content },
          style: { ...sec.style }
        };

        // Xóa các trường tạm (buttonsText, statsText, ...) nếu có để tránh lưu thừa
        delete newSec.content.buttonsText;
        delete newSec.content.statsText;

        // Chuyển đổi buttons từ text sang array
        if (sec.content.buttonsText) {
          newSec.content.buttons = sec.content.buttonsText.split('\n').filter(Boolean).map(line => {
            const [label, variant] = line.split('|');
            return { label: label.trim(), variant: variant?.trim() || 'primary' };
          });
        }

        // Chuyển đổi stats từ text sang array
        if (sec.content.statsText) {
          newSec.content.stats = sec.content.statsText.split('\n').filter(Boolean).map(line => {
            const [value, label] = line.split('|');
            return { value: value.trim(), label: label?.trim() || '' };
          });
        }

        return newSec;
      });

      const payload = {
        slug: data.slug,
        title: data.title,
        sections: formattedSections
      };

      await savePage(payload);
      alert('Lưu trang thành công!');
      navigate('/admin/pages');
    } catch (err) {
      alert('Lỗi khi lưu trang: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const addSection = () => {
    append({ type: 'hero', order: fields.length, content: {}, style: { backgroundColor: '#fbf9f9' } });
  };

  const moveUp = (index) => {
    if (index > 0) move(index, index - 1);
  };

  const moveDown = (index) => {
    if (index < fields.length - 1) move(index, index + 1);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{slug ? 'Chỉnh sửa trang' : 'Tạo trang mới'}</h1>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-bold text-sm">Slug</label>
              <input {...register('slug')} className="w-full border p-2 rounded" disabled={!!slug} placeholder="vi-du-slug" />
            </div>
            <div className="flex-1">
              <label className="block font-bold text-sm">Tiêu đề</label>
              <input {...register('title')} className="w-full border p-2 rounded" placeholder="Tiêu đề trang" />
            </div>
          </div>

          <div>
            <h2 className="font-bold text-lg mb-4">Sections</h2>
            {fields.map((field, index) => (
              <SectionEditor
                key={field.id}
                index={index}
                onRemove={() => remove(index)}
                onMoveUp={() => moveUp(index)}
                onMoveDown={() => moveDown(index)}
              />
            ))}
            <button type="button" onClick={addSection} className="bg-secondary-fixed px-4 py-2 rounded font-bold hover:opacity-90">
              + Thêm section
            </button>
          </div>

          <button type="submit" className="bg-secondary-fixed text-on-secondary-fixed px-6 py-3 rounded font-bold hover:opacity-90" disabled={loading}>
            {loading ? 'Đang lưu...' : 'Lưu trang'}
          </button>
        </form>
      </FormProvider>
    </div>
  );
};

export default PageEditor;