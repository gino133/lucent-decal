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
// revalidate: số giây Vercel được phép dùng lại dữ liệu cũ trước khi lấy mới từ backend.
// Giúp trang tải nhanh hơn nhiều cho khách truy cập, đổi lại nội dung admin sửa
// có thể mất tối đa `revalidate` giây mới hiển thị (thường vẫn rất nhanh).
async function fetchServer(path, { revalidate = 60, ...opts } = {}) {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...opts,
      next: { revalidate },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error("fetchServer error:", path, e.message);
    return null;
  }
}

export const getSettings = () => fetchServer("/settings", { revalidate: 120 });
export const getMenu = (key = "main") => fetchServer(`/menu/${key}`, { revalidate: 120 });
export const getPage = (slug) => fetchServer(`/pages/${slug}`, { revalidate: 30 });
export const getProducts = (query = "") => fetchServer(`/products${query}`, { revalidate: 30 });
export const getProduct = (slug) => fetchServer(`/products/${slug}`, { revalidate: 30 });
export const getProjects = (query = "") => fetchServer(`/projects${query}`, { revalidate: 30 });
export const getProject = (slug) => fetchServer(`/projects/${slug}`, { revalidate: 30 });
export const getPosts = (query = "") => fetchServer(`/posts${query}`, { revalidate: 30 });
export const getPost = (slug) => fetchServer(`/posts/${slug}`, { revalidate: 0 });
export const getCategories = (type) => fetchServer(`/categories${type ? `?type=${type}` : ""}`, { revalidate: 120 });

export { API_URL };
