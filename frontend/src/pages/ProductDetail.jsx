import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct } from '../services/api';

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProduct(slug)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="pt-32 text-center">Đang tải...</div>;
  if (!product) return <div className="pt-32 text-center">Sản phẩm không tồn tại</div>;

  return (
    <main className="pt-32 pb-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-10 flex items-center gap-2 text-on-surface-variant opacity-70 flex-wrap">
        <Link to="/" className="hover:text-secondary transition-colors">Trang chủ</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <Link to="/san-pham" className="hover:text-secondary transition-colors">Sản phẩm</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-on-surface">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Image Gallery */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative group aspect-[4/3] overflow-hidden rounded-lg border border-on-surface/5">
            <img src={product.images?.[0] || 'https://via.placeholder.com/800x600?text=Lucent'} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          {product.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.slice(1).map((img, i) => (
                <div key={i} className="aspect-square rounded border border-on-surface/5 overflow-hidden cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
                  <img src={img} alt={`${product.name} ${i+2}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="mb-2">
            <span className="text-secondary font-label-bold text-label-bold tracking-widest uppercase">
              {product.category === 'frosted' ? 'Privacy Solutions' : 
               product.category === 'pattern' ? 'Decorative Patterns' :
               product.category === 'gradient' ? 'Gradient Effects' : 'Premium Tints'}
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-4">{product.name}</h1>
          <div className="flex items-center gap-6 mb-8 flex-wrap">
            <span className="font-headline-md text-headline-md text-on-surface">{product.price.toLocaleString()}đ/m²</span>
            <span className={`px-3 py-1 font-label-bold text-label-sm rounded-full ${product.inStock !== false ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-error'}`}>
              {product.inStock !== false ? 'Còn hàng' : 'Hết hàng'}
            </span>
          </div>
          <div className="h-[1px] w-full bg-on-surface/10 mb-8"></div>
          <div className="space-y-6 mb-10">
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">{product.description}</p>
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="grid grid-cols-2 gap-y-4 py-6 border-y border-on-surface/5">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary">verified</span>
                    <span className="font-body-md text-body-md text-on-surface">{key}: {value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <button className="flex-1 bg-on-background text-background py-5 font-label-bold text-label-bold rounded hover:bg-on-background/90 transition-all active:scale-[0.98]">
                Mua ngay
              </button>
              <button className="flex-1 border border-on-background py-5 font-label-bold text-label-bold rounded hover:bg-on-background hover:text-background transition-all active:scale-[0.98]">
                Thêm vào giỏ hàng
              </button>
            </div>
            <button className="w-full py-4 flex items-center justify-center gap-3 font-label-bold text-label-bold text-on-surface-variant hover:text-secondary transition-colors underline underline-offset-4">
              <span className="material-symbols-outlined">download</span>
              Tải Catalogue
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;