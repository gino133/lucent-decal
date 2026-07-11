"use client";
import { Fragment, useEffect, useState } from "react";
import { api } from "@/lib/api";

const STATUS_LABELS = {
  new: "Mới", confirmed: "Đã xác nhận", processing: "Đang xử lý",
  shipping: "Đang giao", completed: "Hoàn tất", cancelled: "Đã huỷ",
};
const PAYMENT_LABELS = { pending: "Chờ thanh toán", paid: "Đã thanh toán", failed: "Thất bại", cancelled: "Đã huỷ" };

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);

  async function load() {
    const { data } = await api.get("/orders");
    setOrders(data);
  }
  useEffect(() => { load(); }, []);

  async function updateStatus(id, orderStatus) {
    await api.put(`/orders/${id}`, { orderStatus });
    load();
  }

  function OrderDetails({ o }) {
    return (
      <>
        <p className="text-xs mb-2"><strong>Địa chỉ:</strong> {o.customer?.address}</p>
        {o.customer?.note && <p className="text-xs mb-2"><strong>Ghi chú:</strong> {o.customer.note}</p>}
        <ul className="text-xs space-y-1">
          {o.items?.map((it, i) => (
            <li key={i}>{it.name} × {it.quantity} — {(it.price * it.quantity).toLocaleString("vi-VN")}đ</li>
          ))}
        </ul>
      </>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Đơn hàng ({orders.length})</h1>

      {/* Desktop/tablet ngang: dạng bảng */}
      <div className="hidden md:block bg-white rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-4">Mã đơn</th><th className="p-4">Khách hàng</th><th className="p-4">Tổng tiền</th>
              <th className="p-4">Thanh toán</th><th className="p-4">Trạng thái</th><th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <Fragment key={o._id}>
                <tr className="border-t border-gray-100">
                  <td className="p-4 font-mono text-xs">{o.orderCode}</td>
                  <td className="p-4">{o.customer?.fullName}<br /><span className="text-xs text-gray-400">{o.customer?.phone}</span></td>
                  <td className="p-4 font-semibold">{o.total?.toLocaleString("vi-VN")}đ</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${o.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {PAYMENT_LABELS[o.paymentStatus]}
                    </span>
                  </td>
                  <td className="p-4">
                    <select value={o.orderStatus} onChange={(e) => updateStatus(o._id, e.target.value)} className="border rounded px-2 py-1 text-xs">
                      {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </td>
                  <td className="p-4">
                    <button onClick={() => setExpanded(expanded === o._id ? null : o._id)} className="text-blue-600 text-xs font-semibold whitespace-nowrap">
                      {expanded === o._id ? "Ẩn" : "Chi tiết"}
                    </button>
                  </td>
                </tr>
                {expanded === o._id && (
                  <tr className="bg-gray-50">
                    <td colSpan={6} className="p-4"><OrderDetails o={o} /></td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/tablet đứng: dạng thẻ */}
      <div className="md:hidden space-y-3">
        {orders.map((o) => (
          <div key={o._id} className="bg-white rounded-xl p-4">
            <div className="flex justify-between items-start gap-2 mb-2">
              <div className="min-w-0">
                <p className="font-mono text-xs text-gray-500">{o.orderCode}</p>
                <p className="font-medium truncate">{o.customer?.fullName}</p>
                <p className="text-xs text-gray-400">{o.customer?.phone}</p>
              </div>
              <p className="font-semibold shrink-0">{o.total?.toLocaleString("vi-VN")}đ</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`px-2 py-1 rounded text-xs font-semibold ${o.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                {PAYMENT_LABELS[o.paymentStatus]}
              </span>
              <select value={o.orderStatus} onChange={(e) => updateStatus(o._id, e.target.value)} className="border rounded px-2 py-1 text-xs">
                {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>

            <button
              onClick={() => setExpanded(expanded === o._id ? null : o._id)}
              className="text-blue-600 text-xs font-semibold pt-2 border-t border-gray-100 w-full text-left"
            >
              {expanded === o._id ? "Ẩn chi tiết ▲" : "Xem chi tiết ▼"}
            </button>
            {expanded === o._id && (
              <div className="mt-2 pt-2 border-t border-gray-100">
                <OrderDetails o={o} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
