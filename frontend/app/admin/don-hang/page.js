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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Đơn hàng ({orders.length})</h1>
      <div className="bg-white rounded-xl overflow-hidden">
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
                    <button onClick={() => setExpanded(expanded === o._id ? null : o._id)} className="text-blue-600 text-xs font-semibold">
                      {expanded === o._id ? "Ẩn" : "Chi tiết"}
                    </button>
                  </td>
                </tr>
                {expanded === o._id && (
                  <tr className="bg-gray-50">
                    <td colSpan={6} className="p-4">
                      <p className="text-xs mb-2"><strong>Địa chỉ:</strong> {o.customer?.address}</p>
                      {o.customer?.note && <p className="text-xs mb-2"><strong>Ghi chú:</strong> {o.customer.note}</p>}
                      <ul className="text-xs space-y-1">
                        {o.items?.map((it, i) => (
                          <li key={i}>{it.name} × {it.quantity} — {(it.price * it.quantity).toLocaleString("vi-VN")}đ</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
