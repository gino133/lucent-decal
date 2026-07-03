import { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/api';
import { useForm } from 'react-hook-form';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const res = await getProducts();
    setProducts(res.data);
  };

  const onSubmit = async (data) => {
    try {
      if (editing) {
        await updateProduct(editing, data);
      } else {
        await createProduct(data);
      }
      reset();
      setEditing(null);
      loadProducts();
      alert('Lưu thành công!');
    } catch (err) {
      alert('Lỗi khi lưu sản phẩm');
    }
  };

  const handleEdit = (product) => {
    setEditing(product.slug);
    Object.keys(product).forEach(key => setValue(key, product[key]));
  };

  const handleDelete = async (slug) => {
    if (window.confirm('Xóa sản phẩm này?')) {
      await deleteProduct(slug);
      loadProducts();
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý Sản phẩm</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-surface p-6 rounded shadow mb-8 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input {...register('name')} placeholder="Tên sản phẩm" className="border p-2 rounded" required />
          <input {...register('slug')} placeholder="Slug" className="border p-2 rounded" required />
          <input {...register('price')} type="number" placeholder="Giá (đ/m²)" className="border p-2 rounded" required />
          <input {...register('description')} placeholder="Mô tả" className="border p-2 rounded" />
          <input {...register('images')} placeholder="URL ảnh (cách nhau dấu phẩy)" className="border p-2 rounded col-span-2" />
          <select {...register('category')} className="border p-2 rounded">
            <option value="frosted">Mờ</option>
            <option value="pattern">Hoa văn</option>
            <option value="gradient">Chuyển sắc</option>
            <option value="tint">Phản quang</option>
          </select>
          <select {...register('badge')} className="border p-2 rounded">
            <option value="">Không</option>
            <option value="Mới">Mới</option>
            <option value="Bán chạy">Bán chạy</option>
            <option value="Giảm giá">Giảm giá</option>
          </select>
        </div>
        <div className="flex gap-4">
          <button type="submit" className="bg-secondary-fixed text-on-secondary-fixed px-6 py-2 rounded font-bold">
            {editing ? 'Cập nhật' : 'Thêm mới'}
          </button>
          {editing && (
            <button type="button" onClick={() => { reset(); setEditing(null); }} className="border px-6 py-2 rounded">
              Hủy
            </button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-1 gap-4">
        {products.map(p => (
          <div key={p.slug} className="flex justify-between items-center border-b py-3">
            <div>
              <strong>{p.name}</strong> - {p.price.toLocaleString()}đ/m²
              <span className="ml-4 text-sm text-on-surface-variant">{p.category}</span>
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleEdit(p)} className="text-secondary hover:underline">Sửa</button>
              <button onClick={() => handleDelete(p.slug)} className="text-error hover:underline">Xóa</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ProductManager;