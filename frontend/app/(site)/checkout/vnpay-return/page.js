"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { useCart } from "@/lib/cart-context";

// Trang này nhận redirect từ VNPay sau khi khách thanh toán,
// gửi lại toàn bộ query string cho backend để xác thực chữ ký.
export default function VnpayReturnPage() {
  return (
    <Suspense fallback={<div className="pt-40 text-center">Đang tải...</div>}>
      <VnpayReturnContent />
    </Suspense>
  );
}

function VnpayReturnContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function verify() {
      try {
        const qs = params.toString();
        const { data } = await api.get(`/orders/vnpay-return?${qs}`);
        if (data.success) {
          clearCart();
          setStatus("success");
        } else {
          setStatus("failed");
          setMessage(data.message || "Thanh toán không thành công");
        }
      } catch (err) {
        setStatus("failed");
        setMessage("Không thể xác thực kết quả thanh toán");
      }
    }
    verify();
  }, []);

  return (
    <div className="pt-40 pb-20 text-center px-margin-mobile">
      {status === "checking" && <p>Đang xác thực kết quả thanh toán...</p>}
      {status === "success" && (
        <>
          <span className="material-symbols-outlined text-6xl text-green-500">check_circle</span>
          <h1 className="font-heading text-2xl font-bold mt-4">Thanh toán thành công!</h1>
          <p className="text-on-background/60 mt-2">Cảm ơn bạn đã đặt hàng tại Lucent Glass.</p>
          <button onClick={() => router.push("/")} className="btn-primary mt-8 px-8 py-3 rounded-lg">Về trang chủ</button>
        </>
      )}
      {status === "failed" && (
        <>
          <span className="material-symbols-outlined text-6xl text-red-500">error</span>
          <h1 className="font-heading text-2xl font-bold mt-4">Thanh toán không thành công</h1>
          <p className="text-on-background/60 mt-2">{message}</p>
          <button onClick={() => router.push("/gio-hang")} className="btn-primary mt-8 px-8 py-3 rounded-lg">Thử lại</button>
        </>
      )}
    </div>
  );
}
