"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState({ products: 0, projects: 0, posts: 0, orders: 0, contacts: 0, categories: 0, pendingComments: 0 });

  useEffect(() => {
    async function load() {
      try {
        const [p, pr, po, o, c, cat, cm] = await Promise.all([
          api.get("/products/admin/all"),
          api.get("/projects/admin/all"),
          api.get("/posts/admin/all"),
          api.get("/orders"),
          api.get("/contacts"),
          api.get("/categories"),
          api.get("/comments"),
        ]);
        setStats({
          products: p.data.length,
          projects: pr.data.length,
          posts: po.data.length,
          orders: o.data.length,
          contacts: c.data.filter((c) => c.status === "new").length,
          categories: cat.data.length,
          pendingComments: cm.data.filter((c) => c.status === "pending").length,
        });
      } catch (e) {}
    }
    load();
  }, []);

  const cards = [
    { label: "Sản phẩm", value: stats.products, href: "/admin/san-pham", icon: "inventory_2" },
    { label: "Dự án", value: stats.projects, href: "/admin/du-an", icon: "apartment" },
    { label: "Tin tức", value: stats.posts, href: "/admin/tin-tuc", icon: "newspaper" },
    { label: "Bình luận chờ duyệt", value: stats.pendingComments, href: "/admin/binh-luan", icon: "forum" },
    { label: "Danh mục", value: stats.categories, href: "/admin/danh-muc", icon: "category" },
    { label: "Đơn hàng", value: stats.orders, href: "/admin/don-hang", icon: "receipt_long" },
    { label: "Liên hệ chưa đọc", value: stats.contacts, href: "/admin/lien-he", icon: "mail" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Tổng quan</h1>
      <div className="grid grid-cols-4 gap-6">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <span className="material-symbols-outlined text-3xl text-[#fae519]">{c.icon}</span>
            <div className="text-3xl font-bold mt-3">{c.value}</div>
            <div className="text-sm text-gray-500">{c.label}</div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl p-8 mt-8">
        <h2 className="font-bold text-lg mb-2">Hướng dẫn nhanh</h2>
        <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
          <li>Vào <strong>Giao diện & Cài đặt</strong> để đổi logo, màu sắc, font chữ, thông tin liên hệ.</li>
          <li>Vào <strong>Menu điều hướng</strong> để thêm/sửa/xoá các trang con, kể cả menu đa cấp (dropdown).</li>
          <li>Vào <strong>Nội dung trang</strong> để chỉnh sửa từng khối nội dung của Trang chủ, Giới thiệu, Hồ sơ năng lực, Liên hệ, hoặc tạo trang tuỳ ý mới.</li>
          <li>Vào <strong>Tin tức</strong> để viết bài, và <strong>Bình luận</strong> để duyệt bình luận khách gửi trước khi hiển thị công khai.</li>
          <li>Vào <strong>Sản phẩm / Dự án</strong> để thêm, sửa, xoá dữ liệu hiển thị ngoài website.</li>
        </ul>
      </div>
    </div>
  );
}
