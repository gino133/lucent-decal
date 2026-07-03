import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const AdminLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/admin/login');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  return (
    <div className="pt-20 min-h-screen bg-surface-container-low">
      <div className="flex">
        <aside className="w-64 bg-surface border-r border-outline-variant h-[calc(100vh-5rem)] sticky top-20 overflow-y-auto">
          <nav className="p-4 space-y-2">
            <Link to="/admin" className="block px-4 py-2 rounded hover:bg-secondary-container transition">Dashboard</Link>
            <Link to="/admin/pages" className="block px-4 py-2 rounded hover:bg-secondary-container transition">Quản lý Trang</Link>
            <Link to="/admin/menu" className="block px-4 py-2 rounded hover:bg-secondary-container transition">Menu</Link>
            <Link to="/admin/products" className="block px-4 py-2 rounded hover:bg-secondary-container transition">Sản phẩm</Link>
            <Link to="/admin/projects" className="block px-4 py-2 rounded hover:bg-secondary-container transition">Dự án</Link>
            <Link to="/admin/settings" className="block px-4 py-2 rounded hover:bg-secondary-container transition">Cài đặt</Link>
            <button onClick={handleLogout} className="block w-full text-left px-4 py-2 rounded hover:bg-error-container text-error transition">Đăng xuất</button>
          </nav>
        </aside>
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;