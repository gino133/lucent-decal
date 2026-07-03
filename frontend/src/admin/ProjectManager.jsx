import { useState, useEffect } from 'react';
import { getProjects, createProject, updateProject, deleteProject } from '../services/api';
import { useForm } from 'react-hook-form';

const ProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const res = await getProjects();
    setProjects(res.data);
  };

  const onSubmit = async (data) => {
    try {
      if (editing) {
        await updateProject(editing, data);
      } else {
        await createProject(data);
      }
      reset();
      setEditing(null);
      loadProjects();
      alert('Lưu thành công!');
    } catch (err) {
      alert('Lỗi khi lưu dự án');
    }
  };

  const handleEdit = (project) => {
    setEditing(project.slug);
    Object.keys(project).forEach(key => setValue(key, project[key]));
  };

  const handleDelete = async (slug) => {
    if (window.confirm('Xóa dự án này?')) {
      await deleteProject(slug);
      loadProjects();
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý Dự án</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-surface p-6 rounded shadow mb-8 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input {...register('name')} placeholder="Tên dự án" className="border p-2 rounded" required />
          <input {...register('slug')} placeholder="Slug" className="border p-2 rounded" required />
          <input {...register('location')} placeholder="Địa điểm" className="border p-2 rounded" />
          <input {...register('year')} type="number" placeholder="Năm" className="border p-2 rounded" />
          <textarea {...register('description')} placeholder="Mô tả" className="border p-2 rounded col-span-2" rows="2" />
          <input {...register('coverImage')} placeholder="URL ảnh bìa" className="border p-2 rounded col-span-2" required />
          <input {...register('images')} placeholder="Các ảnh khác (cách nhau dấu phẩy)" className="border p-2 rounded col-span-2" />
          <select {...register('category')} className="border p-2 rounded">
            <option value="Văn phòng">Văn phòng</option>
            <option value="Nhà ở">Nhà ở</option>
            <option value="Thương mại">Thương mại</option>
          </select>
        </div>
        <div className="flex gap-4">
          <button type="submit" className="bg-secondary-fixed text-on-secondary-fixed px-6 py-2 rounded font-bold">
            {editing ? 'Cập nhật' : 'Thêm mới'}
          </button>
          {editing && (
            <button type="button" onClick={() => { reset(); setEditing(null); }} className="border px-6 py-2 rounded">
              Hủy
            </button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-1 gap-4">
        {projects.map(p => (
          <div key={p.slug} className="flex justify-between items-center border-b py-3">
            <div>
              <strong>{p.name}</strong> - {p.category}
              <span className="ml-4 text-sm text-on-surface-variant">{p.location}</span>
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleEdit(p)} className="text-secondary hover:underline">Sửa</button>
              <button onClick={() => handleDelete(p.slug)} className="text-error hover:underline">Xóa</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ProjectManager;