import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllPages, deletePage } from '../services/api';

const PageList = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await getAllPages();
      setPages(res.data);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug) => {
    if (window.confirm(`Bạn có chắc muốn xóa trang "${slug}"?`)) {
      try {
        await deletePage(slug);
        fetchPages();
      } catch (error) {
        alert('Xóa thất bại!');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Trang</h1>
        <Link to="/admin/pages/new" className="bg-secondary-fixed text-on-secondary-fixed px-4 py-2 rounded font-bold hover:opacity-90">
          + Thêm mới
        </Link>
      </div>
      <div className="bg-surface rounded-xl shadow-sm border border-outline-variant overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface-container-low">
            <tr>
              <th className="text-left p-4 font-bold text-sm uppercase">Tiêu đề</th>
              <th className="text-left p-4 font-bold text-sm uppercase">Slug</th>
              <th className="text-left p-4 font-bold text-sm uppercase">Số section</th>
              <th className="text-right p-4 font-bold text-sm uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.slug} className="border-t border-outline-variant">
                <td className="p-4">{page.title}</td>
                <td className="p-4 text-on-surface-variant">/{page.slug}</td>
                <td className="p-4 text-center">{page.sections?.length || 0}</td>
                <td className="p-4 text-right space-x-2">
                  <Link to={`/admin/pages/${page.slug}`} className="text-secondary hover:underline">Sửa</Link>
                  <button onClick={() => handleDelete(page.slug)} className="text-error hover:underline">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PageList;