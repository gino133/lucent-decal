"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AdminAuthProvider, useAdminAuth } from "@/lib/admin-auth";

const NAV = [
  { href: "/admin/dashboard", label: "Tổng quan", icon: "dashboard" },
  { href: "/admin/trang", label: "Nội dung trang", icon: "article" },
  { href: "/admin/menu", label: "Menu điều hướng", icon: "menu" },
  { href: "/admin/san-pham", label: "Sản phẩm", icon: "inventory_2" },
  { href: "/admin/du-an", label: "Dự án", icon: "apartment" },
  { href: "/admin/danh-muc", label: "Danh mục", icon: "category" },
  { href: "/admin/don-hang", label: "Đơn hàng", icon: "receipt_long" },
  { href: "/admin/lien-he", label: "Liên hệ", icon: "mail" },
  { href: "/admin/giao-dien", label: "Giao diện & Cài đặt", icon: "palette" },
];

function AdminShell({ children }) {
  const { user, loading, logout } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/dang-nhap") return children;

  if (loading) return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;

  if (!user) {
    if (typeof window !== "undefined") router.replace("/admin/dang-nhap");
    return null;
  }

  return (
    <div className="min-h-screen flex bg-[#f4f4f2]">
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined" />
      <aside className="w-64 bg-[#1b1c1c] text-white flex flex-col fixed h-screen">
        <div className="p-6 font-bold text-lg border-b border-white/10">Lucent Glass CMS</div>
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
      <main className="flex-1 ml-64 p-8">{children}</main>
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
