"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/admin-auth";

export default function AdminLoginPage() {
  const { login } = useAdminAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1b1c1c] px-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-10 w-full max-w-md">
        <h1 className="font-bold text-2xl mb-2">Trang quản trị</h1>
        <p className="text-sm text-gray-500 mb-8">Đăng nhập để quản lý nội dung website</p>
        <input
          required
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4"
        />
        <input
          required
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4"
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button disabled={loading} className="w-full bg-[#fae519] text-black font-bold rounded-lg py-3 disabled:opacity-50">
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}
