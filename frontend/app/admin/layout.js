"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminAuthProvider, useAdminAuth } from "@/lib/admin-auth";

const NAV = [
  { href: "/admin/dashboard", label: "Tổng quan", icon: "dashboard" },
  { href: "/admin/trang", label: "Nội dung trang", icon: "article" },
  { href: "/admin/menu", label: "Menu điều hướng", icon: "menu" },
  { href: "/admin/san-pham", label: "Sản phẩm", icon: "inventory_2" },
  { href: "/admin/du-an", label: "Dự án", icon: "apartment" },
  { href: "/admin/tin-tuc", label: "Tin tức", icon: "newspaper" },
  { href: "/admin/binh-luan", label: "Bình luận", icon: "forum" },
  { href: "/admin/danh-muc", label: "Danh mục", icon: "category" },
  { href: "/admin/don-hang", label: "Đơn hàng", icon: "receipt_long" },
  { href: "/admin/lien-he", label: "Liên hệ", icon: "mail" },
  { href: "/admin/giao-dien", label: "Giao diện & Cài đặt", icon: "palette" },
];

function AdminShell({ children }) {
  const { user, loading, logout } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  // Đóng menu mỗi khi chuyển trang (bấm 1 mục trong menu)
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  // Bấm ra ngoài vùng sidebar (trên nền mờ) sẽ tự đóng menu, không bắt buộc bấm nút X
  useEffect(() => {
    if (!sidebarOpen) return;
    function handleClickOutside(e) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [sidebarOpen]);

  if (pathname === "/admin/dang-nhap") return children;

  if (loading) return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;

  if (!user) {
    if (typeof window !== "undefined") router.replace("/admin/dang-nhap");
    return null;
  }

  const currentLabel = NAV.find((item) => pathname.startsWith(item.href))?.label || "Quản trị";

  return (
    <div className="min-h-screen bg-[#f4f4f2]">
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined" />

      {/* Thanh trên cùng — chỉ hiện trên mobile/tablet */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-30 bg-[#1b1c1c] text-white flex items-center justify-between px-4 py-3">
        <button onClick={() => setSidebarOpen(true)} aria-label="Mở menu" className="p-1">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <span className="font-semibold text-sm truncate">{currentLabel}</span>
        <div className="w-7" />
      </header>

      {/* Nền mờ phía sau menu khi mở trên mobile */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" aria-hidden="true" />
      )}

      {/* Sidebar: cố định hiện trên desktop, trượt ra/vào trên mobile */}
      <aside
        ref={sidebarRef}
        className={`w-72 max-w-[80vw] md:w-64 bg-[#1b1c1c] text-white flex flex-col fixed h-screen z-50 top-0 left-0
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="p-6 font-bold text-lg border-b border-white/10 flex items-center justify-between">
          Lucent Glass CMS
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1" aria-label="Đóng menu">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 text-sm hover:bg-white/10 ${pathname.startsWith(item.href) ? "bg-white/10 border-l-4 border-[#fae519]" : ""}`}
            >
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10 text-sm">
          <p className="mb-2 opacity-70">{user.name}</p>
          <button onClick={logout} className="text-red-300 hover:text-red-400">Đăng xuất</button>
        </div>
      </aside>

      <main className="md:ml-64 p-4 pt-20 md:p-8 md:pt-8 overflow-x-hidden">{children}</main>
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}
