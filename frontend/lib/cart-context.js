"use client";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "lucentglass_cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, loaded]);

  function addItem(product, quantity = 1, variant = "") {
    setItems((prev) => {
      const key = product._id + (variant || "");
      const existing = prev.find((it) => it.key === key);
      if (existing) {
        return prev.map((it) => (it.key === key ? { ...it, quantity: it.quantity + quantity } : it));
      }
      return [
        ...prev,
        {
          key,
          product: product._id,
          name: product.name,
          image: product.images?.[0] || "",
          price: product.price,
          variant,
          quantity,
        },
      ];
    });
  }

  function updateQuantity(key, quantity) {
    setItems((prev) => prev.map((it) => (it.key === key ? { ...it, quantity: Math.max(1, quantity) } : it)));
  }

  function removeItem(key) {
    setItems((prev) => prev.filter((it) => it.key !== key));
  }

  function clearCart() {
    setItems([]);
  }

  const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const totalQuantity = items.reduce((sum, it) => sum + it.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clearCart, subtotal, totalQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart phải được dùng trong CartProvider");
  return ctx;
}
