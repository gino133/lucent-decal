import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPage, savePage } from '../services/api';
import { useForm, useFieldArray } from 'react-hook-form';

const PageEditor = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { register, control, handleSubmit, setValue, getValues } = useForm({
    defaultValues: { slug: '', title: '', sections: [] }
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'sections' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (slug) {
      getPage(slug).then(res => {
        const data = res.data;
        setValue('slug', data.slug);
        setValue('title', data.title);
        setValue('sections', data.sections || []);
      }).catch(() => {});
    }
  }, [slug, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await savePage(data);
      alert('Lưu thành công!');
      navigate('/admin/pages');
    } catch (err) {
      alert('Lỗi khi lưu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{slug ? 'Chỉnh sửa trang' : 'Tạo trang mới'}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block font-bold">Slug</label>
          <input {...register('slug')} className="w-full border p-2 rounded" disabled={!!slug} />
        </div>
        <div>
          <label className="block font-bold">Tiêu đề</label>
          <input {...register('title')} className="w-full border p-2 rounded" />
        </div>
        <div>
          <h2 className="font-bold text-lg">Sections</h2>
          {fields.map((field, index) => (
            <div key={field.id} className="border p-4 my-4 rounded">
              <div className="flex gap-4">
                <input {...register(`sections.${index}.type`)} placeholder="Loại section (hero, intro...)" className="border p-2 flex-1" />
                <button type="button" onClick={() => remove(index)} className="bg-error text-white px-3 rounded">Xóa</button>
              </div>
              <textarea {...register(`sections.${index}.content`)} placeholder="Nội dung (JSON)" className="w-full border p-2 mt-2" rows="2" />
              <textarea {...register(`sections.${index}.style`)} placeholder="Style (JSON)" className="w-full border p-2 mt-2" rows="2" />
            </div>
          ))}
          <button type="button" onClick={() => append({ type: 'hero', content: {}, style: {} })} className="bg-secondary-fixed px-4 py-2 rounded">+ Thêm section</button>
        </div>
        <button type="submit" className="bg-secondary-fixed text-on-secondary-fixed px-6 py-2 rounded font-bold" disabled={loading}>
          {loading ? 'Đang lưu...' : 'Lưu trang'}
        </button>
      </form>
    </div>
  );
};

export default PageEditor;