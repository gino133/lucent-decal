import { useState } from 'react';
import { Link } from 'react-router-dom';

const Cart = () => {
  // Giỏ hàng mẫu, sau này có thể lấy từ Context/Redux
  const [items, setItems] = useState([
    { id: 1, name: 'Decal Mờ Phun Cát', price: 850000, quantity: 1, image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Decal Hoa Văn', price: 600000, quantity: 2, image: 'https://via.placeholder.com/150' },
  ]);

  const updateQuantity = (id, delta) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const vat = total * 0.1;
  const grandTotal = total + vat;

  if (items.length === 0) {
    return (
      <main className="pt-32 pb-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-center">
        <h1 className="font-headline-lg text-headline-lg mb-6">Giỏ hàng trống</h1>
        <p className="text-on-surface-variant mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
        <Link to="/san-pham" className="bg-secondary-fixed text-on-secondary-fixed px-8 py-3 rounded-lg font-bold hover:opacity-90 transition">Tiếp tục mua sắm</Link>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Danh sách sản phẩm */}
        <div className="w-full lg:w-[65%] space-y-8">
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Giỏ hàng của bạn</h1>
          <div className="space-y-6">
            {items.map(item => (
              <div key={item.id} className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-surface border border-on-surface/5 rounded-lg">
                <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-headline-md text-headline-md text-on-surface">{item.name}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center border border-outline/20 rounded">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 px-3 hover:bg-surface-variant transition-colors">-</button>
                      <span className="px-4 font-label-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 px-3 hover:bg-surface-variant transition-colors">+</button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="flex items-center gap-1 text-error text-xs font-label-bold hover:underline">
                      <span className="material-symbols-outlined text-sm">delete</span> Xóa
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-headline-md text-headline-md text-on-surface">{(item.price * item.quantity).toLocaleString()}đ</span>
                </div>
              </div>
            ))}
          </div>

          {/* Form thông tin khách hàng */}
          <section className="bg-surface-container-low p-8 rounded-xl border border-on-surface/5">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-6 border-l-4 border-secondary pl-4">Thông tin khách hàng</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-label-bold text-label-bold text-on-surface">HỌ VÀ TÊN</label>
                <input type="text" className="w-full border p-3 rounded focus:ring-secondary focus:border-secondary" placeholder="Nhập tên của bạn" />
              </div>
              <div>
                <label className="font-label-bold text-label-bold text-on-surface">SỐ ĐIỆN THOẠI</label>
                <input type="tel" className="w-full border p-3 rounded focus:ring-secondary focus:border-secondary" placeholder="0xxx xxx xxx" />
              </div>
              <div className="md:col-span-2">
                <label className="font-label-bold text-label-bold text-on-surface">ĐỊA CHỈ GIAO HÀNG</label>
                <input type="text" className="w-full border p-3 rounded focus:ring-secondary focus:border-secondary" placeholder="Số nhà, đường, phường, quận, thành phố" />
              </div>
              <div className="md:col-span-2">
                <label className="font-label-bold text-label-bold text-on-surface">GHI CHÚ ĐƠN HÀNG</label>
                <textarea className="w-full border p-3 rounded focus:ring-secondary focus:border-secondary" rows="3" placeholder="Lưu ý đặc biệt cho chúng tôi..."></textarea>
              </div>
            </form>
          </section>
        </div>

        {/* Tóm tắt đơn hàng */}
        <aside className="w-full lg:w-[35%] sticky top-32">
          <div className="bg-on-surface text-surface p-8 rounded-xl shadow-2xl">
            <h2 className="font-headline-md text-headline-md mb-8">Tóm tắt đơn hàng</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between"><span>Tạm tính</span><span>{total.toLocaleString()}đ</span></div>
              <div className="flex justify-between"><span>Thuế (VAT 10%)</span><span>{vat.toLocaleString()}đ</span></div>
              <div className="flex justify-between"><span>Phí vận chuyển</span><span>Miễn phí</span></div>
              <div className="pt-4 border-t flex justify-between"><span className="font-headline-md">Tổng cộng</span><span className="font-headline-md text-secondary-fixed">{grandTotal.toLocaleString()}đ</span></div>
            </div>
            <button className="w-full bg-secondary-fixed text-on-secondary-fixed font-label-bold text-label-bold py-4 rounded hover:bg-secondary-fixed-dim transition-colors flex items-center justify-center gap-2 group">
              THANH TOÁN <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
            <p className="text-center text-surface-container-highest/60 text-[10px] uppercase tracking-widest font-label-bold mt-2">Cam kết bảo mật thanh toán 100%</p>
          </div>
          <Link to="/san-pham" className="flex items-center justify-center gap-2 mt-6 text-on-surface-variant font-label-bold hover:text-secondary transition-colors group">
            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span> Tiếp tục mua sắm
          </Link>
        </aside>
      </div>
    </main>
  );
};

export default Cart;