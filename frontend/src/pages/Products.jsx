import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(res => setProducts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="pt-32 text-center">Đang tải sản phẩm...</div>;

  return (
    <main className="pt-32 pb-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <div className="border-l-4 border-secondary pl-6 mb-12">
        <span className="font-label-bold text-label-bold text-secondary uppercase tracking-widest block mb-2">Kiến Trúc Hoàn Hảo</span>
        <h1 className="font-headline-xl text-headline-xl">Danh Mục Sản Phẩm</h1>
      </div>
      {products.length === 0 ? (
        <p className="text-center text-on-surface-variant">Chưa có sản phẩm nào</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.slug} className="glass-card group flex flex-col h-full hover:shadow-lg transition-all">
              <div className="relative overflow-hidden aspect-[4/5]">
                <img src={product.images?.[0] || 'https://via.placeholder.com/400x500?text=Lucent'} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                {product.badge && (
                  <span className="absolute top-4 right-4 bg-secondary-container text-on-secondary-container font-label-sm text-label-sm px-3 py-1 rounded-full">{product.badge}</span>
                )}
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-headline-md text-headline-md text-on-surface mb-1">{product.name}</h3>
                <p className="font-body-md text-on-surface-variant mb-4">{product.description}</p>
                <div className="mb-6">
                  <span className="block font-label-sm text-label-sm text-outline uppercase tracking-wider">Giá mỗi m²</span>
                  <span className="font-headline-md text-headline-md text-on-surface">{product.price.toLocaleString()}đ</span>
                </div>
                <div className="mt-auto flex flex-col gap-3">
                  <Link to={`/san-pham/${product.slug}`} className="w-full bg-secondary-fixed text-on-secondary-fixed py-3 rounded-lg font-label-bold text-label-bold uppercase tracking-wider text-center hover:shadow-md transition-all active:scale-95">
                    Xem chi tiết
                  </Link>
                  <button className="w-full border border-on-surface/20 text-on-surface py-3 rounded-lg font-label-bold text-label-bold uppercase tracking-wider hover:bg-on-surface/5 transition-all">
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Products;