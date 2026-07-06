import React, { useState, useEffect } from 'react';
import { getAllPages } from '../services/api';
// Nếu chưa có API cho products/projects, dùng axios riêng

const Dashboard = () => {
  const [stats, setStats] = useState({ pages: 0, products: 0, projects: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const pages = await getAllPages();
        // Giả sử bạn đã có API getProducts, getProjects
        // const products = await getProducts();
        // const projects = await getProjects();
        setStats({ pages: pages.data.length, products: 0, projects: 0 });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface p-6 rounded-xl shadow-sm border border-outline-variant">
          <h3 className="text-sm font-bold uppercase text-on-surface-variant">Trang</h3>
          <p className="text-4xl font-bold mt-2">{stats.pages}</p>
        </div>
        <div className="bg-surface p-6 rounded-xl shadow-sm border border-outline-variant">
          <h3 className="text-sm font-bold uppercase text-on-surface-variant">Sản phẩm</h3>
          <p className="text-4xl font-bold mt-2">{stats.products}</p>
        </div>
        <div className="bg-surface p-6 rounded-xl shadow-sm border border-outline-variant">
          <h3 className="text-sm font-bold uppercase text-on-surface-variant">Dự án</h3>
          <p className="text-4xl font-bold mt-2">{stats.projects}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;