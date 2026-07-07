import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const api = axios.create({ baseURL: API_URL });

// Gắn token admin (nếu có) cho các request phía client
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

// ---- Hàm fetch dùng ở Server Components (SSR) ----
async function fetchServer(path, opts = {}) {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...opts,
      // Luôn lấy dữ liệu mới để admin sửa nội dung là thấy ngay
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error("fetchServer error:", path, e.message);
    return null;
  }
}

export const getSettings = () => fetchServer("/settings");
export const getMenu = (key = "main") => fetchServer(`/menu/${key}`);
export const getPage = (slug) => fetchServer(`/pages/${slug}`);
export const getProducts = (query = "") => fetchServer(`/products${query}`);
export const getProduct = (slug) => fetchServer(`/products/${slug}`);
export const getProjects = (query = "") => fetchServer(`/projects${query}`);
export const getProject = (slug) => fetchServer(`/projects/${slug}`);
export const getCategories = (type) => fetchServer(`/categories${type ? `?type=${type}` : ""}`);

export { API_URL };
