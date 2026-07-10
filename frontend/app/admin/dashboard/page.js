"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

const SOURCES = [
  { key: "products", label: "Sản phẩm", href: "/admin/san-pham", icon: "inventory_2", url: "/products/admin/all", count: (d) => d.length },
  { key: "projects", label: "Dự án", href: "/admin/du-an", icon: "apartment", url: "/projects/admin/all", count: (d) => d.length },
  { key: "posts", label: "Tin tức", href: "/admin/tin-tuc", icon: "newspaper", url: "/posts/admin/all", count: (d) => d.length },
  { key: "pendingComments", label: "Bình luận chờ duyệt", href: "/admin/binh-luan", icon: "forum", url: "/comments", count: (d) => d.filter((c) => c.status === "pending").length },
  { key: "categories", label: "Danh mục", href: "/admin/danh-muc", icon: "category", url: "/categories", count: (d) => d.length },
  { key: "orders", label: "Đơn hàng", href: "/admin/don-hang", icon: "receipt_long", url: "/orders", count: (d) => d.length },
  { key: "contacts", label: "Liên hệ chưa đọc", href: "/admin/lien-he", icon: "mail", url: "/contacts", count: (d) => d.filter((c) => c.status === "new").length },
];

export default function DashboardPage() {
  const [stats, setStats] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // Dùng allSettled thay vì all: 1 API lỗi sẽ không làm mất số liệu của các API còn lại
      const results = await Promise.allSettled(SOURCES.map((s) => api.get(s.url)));

      const nextStats = {};
      const nextErrors = {};
      results.forEach((res, i) => {
        const source = SOURCES[i];
        if (res.status === "fulfilled") {
          nextStats[source.key] = source.count(res.value.data);
        } else {
          nextErrors[source.key] = true;
          console.error(`Lỗi tải số liệu "${source.label}":`, res.reason);
        }
      });
      setStats(nextStats);
      setErrors(nextErrors);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Tổng quan</h1>

      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-4 mb-6">
          Không tải được số liệu: {SOURCES.filter((s) => errors[s.key]).map((s) => s.label).join(", ")}.
          Có thể do API chưa deploy xong hoặc phiên đăng nhập hết hạn — thử tải lại trang.
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {SOURCES.map((s) => (
          <Link key={s.href} href={s.href} className="bg-white rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
            <span className="material-symbols-outlined text-2xl md:text-3xl text-[#fae519]">{s.icon}</span>
            <div className="text-2xl md:text-3xl font-bold mt-2 md:mt-3">
              {loading ? "…" : errors[s.key] ? "—" : stats[s.key]}
            </div>
            <div className="text-xs md:text-sm text-gray-500">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl p-6 md:p-8 mt-8">
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
