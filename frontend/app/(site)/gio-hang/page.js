"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { api } from "@/lib/api";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, clearCart } = useCart();
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", address: "", note: "" });
  const [paymentMethod, setPaymentMethod] = useState("vnpay");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const shippingFee = subtotal >= 2000000 || subtotal === 0 ? 0 : 50000;
  const vatAmount = Math.round((subtotal * 10) / 100);
  const total = subtotal + shippingFee + vatAmount;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleCheckout(e) {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const payload = {
        customer: form,
        items: items.map((it) => ({
          product: it.product,
          name: it.name,
          image: it.image,
          variant: it.variant,
          price: it.price,
          quantity: it.quantity,
        })),
        paymentMethod,
      };
      const { data } = await api.post("/orders", payload);
      if (data.paymentUrl) {
        window.localStorage.setItem("pending_order_code", data.order.orderCode);
        window.location.href = data.paymentUrl;
      } else {
        clearCart();
        window.location.href = `/checkout/thanh-cong?code=${data.order.orderCode}`;
      }
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="pt-40 pb-20 text-center px-margin-mobile">
        <span className="material-symbols-outlined text-5xl text-on-background/30">shopping_cart</span>
        <h1 className="font-heading text-2xl font-bold mt-4 mb-2">Giỏ hàng của bạn đang trống</h1>
        <Link href="/san-pham" className="text-secondary font-semibold underline">Tiếp tục mua sắm →</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-20">
      <h1 className="font-heading text-3xl font-bold mb-10">Giỏ hàng ({items.length} sản phẩm)</h1>

      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-4">
          {items.map((it) => (
            <div key={it.key} className="flex gap-4 border border-on-background/10 rounded-xl p-4">
              <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-surface flex-shrink-0">
                {it.image && <Image src={it.image} alt={it.name} fill className="object-cover" />}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{it.name}</h3>
                {it.variant && <p className="text-xs text-on-background/50 mt-1">{it.variant}</p>}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-on-background/20 rounded-lg">
                    <button onClick={() => updateQuantity(it.key, it.quantity - 1)} className="px-3 py-1">−</button>
                    <span className="px-3 font-semibold text-sm">{it.quantity}</span>
                    <button onClick={() => updateQuantity(it.key, it.quantity + 1)} className="px-3 py-1">+</button>
                  </div>
                  <span className="font-bold">{(it.price * it.quantity).toLocaleString("vi-VN")}đ</span>
                </div>
              </div>
              <button onClick={() => removeItem(it.key)} className="text-on-background/40 hover:text-red-500">
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          ))}
        </div>

        <div>
          <div className="border border-on-background/10 rounded-xl p-6 mb-6">
            <h2 className="font-heading font-bold text-lg mb-4">Tóm tắt đơn hàng</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Tạm tính</span><span>{subtotal.toLocaleString("vi-VN")}đ</span></div>
              <div className="flex justify-between"><span>Phí vận chuyển</span><span>{shippingFee === 0 ? "Miễn phí" : shippingFee.toLocaleString("vi-VN") + "đ"}</span></div>
              <div className="flex justify-between"><span>Thuế (VAT 10%)</span><span>{vatAmount.toLocaleString("vi-VN")}đ</span></div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-on-background/10">
                <span>Tổng cộng</span><span>{total.toLocaleString("vi-VN")}đ</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleCheckout} className="border border-on-background/10 rounded-xl p-6 space-y-3">
            <h2 className="font-heading font-bold text-lg mb-2">Thông tin khách hàng</h2>
            <input required name="fullName" placeholder="Họ và tên" value={form.fullName} onChange={handleChange} className="w-full border border-on-background/20 rounded-lg px-3 py-2 text-sm" />
            <input required name="phone" placeholder="Số điện thoại" value={form.phone} onChange={handleChange} className="w-full border border-on-background/20 rounded-lg px-3 py-2 text-sm" />
            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full border border-on-background/20 rounded-lg px-3 py-2 text-sm" />
            <input required name="address" placeholder="Địa chỉ giao hàng" value={form.address} onChange={handleChange} className="w-full border border-on-background/20 rounded-lg px-3 py-2 text-sm" />
            <textarea name="note" placeholder="Ghi chú đơn hàng" value={form.note} onChange={handleChange} rows={2} className="w-full border border-on-background/20 rounded-lg px-3 py-2 text-sm" />

            <div className="flex gap-3 text-sm pt-1">
              <label className="flex items-center gap-2">
                <input type="radio" checked={paymentMethod === "vnpay"} onChange={() => setPaymentMethod("vnpay")} /> Thanh toán VNPay
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} /> Thanh toán khi nhận hàng
              </label>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button disabled={loading} className="btn-primary w-full rounded-lg py-3 font-semibold lemon-glow disabled:opacity-50">
              {loading ? "Đang xử lý..." : "Tiến hành thanh toán"}
            </button>
            <p className="text-xs text-on-background/50 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">verified_user</span> Cam kết bảo mật thanh toán 100%.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
