"use client";
import { Fragment, useEffect, useState } from "react";
import { api, friendlyErrorMessage } from "@/lib/api";

const STATUS_LABELS = {
  new: "Mới", confirmed: "Đã xác nhận", processing: "Đang xử lý",
  shipping: "Đang giao", completed: "Hoàn tất", cancelled: "Đã huỷ",
};
const PAYMENT_LABELS = { pending: "Chờ thanh toán", paid: "Đã thanh toán", failed: "Thất bại", cancelled: "Đã huỷ" };
const SORT_LABELS = {
  newest: "Mới nhất", oldest: "Cũ nhất",
  total_desc: "Giá trị: cao → thấp", total_asc: "Giá trị: thấp → cao",
};

const DEFAULT_FILTERS = { search: "", status: "", paymentStatus: "", minTotal: "", maxTotal: "", sort: "newest", includeHidden: false };

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [searchInput, setSearchInput] = useState(""); // ô gõ riêng, debounce trước khi đưa vào filters.search

  async function load(f) {
    setLoading(true);
    const params = new URLSearchParams();
    if (f.search) params.set("search", f.search);
    if (f.status) params.set("status", f.status);
    if (f.paymentStatus) params.set("paymentStatus", f.paymentStatus);
    if (f.minTotal) params.set("minTotal", f.minTotal);
    if (f.maxTotal) params.set("maxTotal", f.maxTotal);
    if (f.sort) params.set("sort", f.sort);
    if (f.includeHidden) params.set("includeHidden", "true");
    try {
      const { data } = await api.get(`/orders?${params.toString()}`);
      setOrders(data);
    } catch (err) {
      alert("Không tải được danh sách đơn hàng: " + friendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(filters); }, [filters]);

  // gõ tìm kiếm thì đợi 400ms sau khi ngừng gõ mới gọi API, tránh gọi liên tục từng ký tự
  useEffect(() => {
    const t = setTimeout(() => setFilters((f) => ({ ...f, search: searchInput })), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  function updateFilter(key, value) {
    setFilters((f) => ({ ...f, [key]: value }));
  }

  function resetFilters() {
    setSearchInput("");
    setFilters(DEFAULT_FILTERS);
  }

  const hasActiveFilters =
    filters.search || filters.status || filters.paymentStatus || filters.minTotal || filters.maxTotal || filters.sort !== "newest";

  async function updateStatus(id, orderStatus) {
    await api.put(`/orders/${id}`, { orderStatus });
    load(filters);
  }

  // ẩn: chỉ giấu khỏi danh sách chính, vẫn xem lại được qua "Hiện đơn đã ẩn" — an toàn hơn xoá hẳn
  async function toggleHidden(o) {
    try {
      await api.put(`/orders/${o._id}`, { isHidden: !o.isHidden });
      load(filters);
    } catch (err) {
      alert("Thao tác thất bại: " + friendlyErrorMessage(err));
    }
  }

  // xoá vĩnh viễn: mất hẳn khỏi database, không hoàn tác được — cảnh báo rõ trước khi xoá
  async function deleteForever(o) {
    const ok = window.confirm(
      `Xoá VĨNH VIỄN đơn hàng "${o.orderCode}"? Hành động này KHÔNG THỂ hoàn tác. Nếu chỉ muốn tạm giấu đơn này đi, hãy dùng nút "Ẩn" thay vì xoá.`
    );
    if (!ok) return;
    try {
      await api.delete(`/orders/${o._id}`);
      load(filters);
    } catch (err) {
      alert("Xoá thất bại: " + friendlyErrorMessage(err));
    }
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

  function RowActions({ o }) {
    return (
      <div className="flex items-center gap-3 flex-wrap justify-end">
        <button onClick={() => setExpanded(expanded === o._id ? null : o._id)} className="text-blue-600 text-xs font-semibold whitespace-nowrap">
          {expanded === o._id ? "Ẩn chi tiết" : "Chi tiết"}
        </button>
        <button onClick={() => toggleHidden(o)} className="text-gray-500 hover:text-gray-800 text-xs font-semibold whitespace-nowrap">
          {o.isHidden ? "Bỏ ẩn" : "Ẩn"}
        </button>
        <button onClick={() => deleteForever(o)} className="text-red-600 hover:text-red-800 text-xs font-semibold whitespace-nowrap">
          Xoá vĩnh viễn
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Đơn hàng ({orders.length})</h1>
      </div>

      {/* Bộ lọc + sắp xếp */}
      <div className="bg-white rounded-xl p-4 mb-6 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs text-gray-500 mb-1">Tìm theo mã đơn / tên / SĐT khách</label>
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="VD: LG20260709 hoặc Trần Cao Hải hoặc 0988..."
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Trạng thái đơn</label>
          <select value={filters.status} onChange={(e) => updateFilter("status", e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
            <option value="">Tất cả</option>
            {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Thanh toán</label>
          <select value={filters.paymentStatus} onChange={(e) => updateFilter("paymentStatus", e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
            <option value="">Tất cả</option>
            {Object.entries(PAYMENT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Giá trị từ</label>
          <input
            type="number" min="0" placeholder="0"
            value={filters.minTotal}
            onChange={(e) => updateFilter("minTotal", e.target.value)}
            className="w-28 border rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">đến</label>
          <input
            type="number" min="0" placeholder="Không giới hạn"
            value={filters.maxTotal}
            onChange={(e) => updateFilter("maxTotal", e.target.value)}
            className="w-32 border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Sắp xếp</label>
          <select value={filters.sort} onChange={(e) => updateFilter("sort", e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
            {Object.entries(SORT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>

        <label className="flex items-center gap-1.5 text-xs text-gray-600 pb-2 cursor-pointer whitespace-nowrap">
          <input type="checkbox" checked={filters.includeHidden} onChange={(e) => updateFilter("includeHidden", e.target.checked)} />
          Hiện cả đơn đã ẩn
        </label>

        {hasActiveFilters && (
          <button onClick={resetFilters} className="text-xs text-gray-400 hover:text-gray-700 underline pb-2 whitespace-nowrap">
            Xoá bộ lọc
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Đang tải...</p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-gray-400 bg-white rounded-xl p-6 text-center">Không có đơn hàng nào khớp bộ lọc hiện tại.</p>
      ) : (
        <>
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
                    <tr className={`border-t border-gray-100 ${o.isHidden ? "opacity-50" : ""}`}>
                      <td className="p-4 font-mono text-xs">
                        {o.orderCode}
                        {o.isHidden && <span className="ml-2 text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">Đã ẩn</span>}
                      </td>
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
                      <td className="p-4"><RowActions o={o} /></td>
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
              <div key={o._id} className={`bg-white rounded-xl p-4 ${o.isHidden ? "opacity-50" : ""}`}>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-gray-500">
                      {o.orderCode}
                      {o.isHidden && <span className="ml-2 text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">Đã ẩn</span>}
                    </p>
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

                <div className="pt-2 border-t border-gray-100">
                  <RowActions o={o} />
                </div>

                {expanded === o._id && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <OrderDetails o={o} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
