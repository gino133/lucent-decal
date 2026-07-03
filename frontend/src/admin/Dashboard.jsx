import { useEffect, useState } from 'react';
import { getAllPages } from '../services/api';

const Dashboard = () => {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    getAllPages().then(res => setPages(res.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="bg-surface p-4 rounded shadow">
        <p className="font-bold">Tổng số trang: {pages.length}</p>
        <ul className="mt-4 space-y-1">
          {pages.map(p => <li key={p.slug} className="text-on-surface-variant">- {p.slug} ({p.title})</li>)}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;