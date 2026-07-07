"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import ProductForm from "@/components/admin/ProductForm";

export default function EditProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    api.get("/products/admin/all").then((res) => {
      setProduct(res.data.find((p) => p._id === id));
    });
  }, [id]);

  if (!product) return <p>Đang tải...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Sửa sản phẩm</h1>
      <ProductForm initial={product} productId={id} />
    </div>
  );
}
