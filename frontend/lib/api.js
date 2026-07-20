import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// timeout 25s để phân biệt lỗi ngay lập tức (CORS/kết nối chặn) với lỗi do chờ quá lâu
export const api = axios.create({ baseURL: API_URL, timeout: 25000 });

// gắn token admin cho mọi request nếu đã đăng nhập
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

// tự thử lại nếu lỗi mạng/timeout (thường do server free-tier đang thức dậy),
// dùng cho các thao tác lưu quan trọng để khỏi mất công gõ lại
export async function apiWithRetry(method, url, data, config, retries = 2) {
  const startedAt = Date.now();
  try {
    return await api[method](url, data, config);
  } catch (err) {
    err._elapsedMs = Date.now() - startedAt; // lưu lại để báo lỗi cho rõ
    const isNetworkError = !err.response;
    if (isNetworkError && retries > 0) {
      await new Promise((r) => setTimeout(r, 6000));
      return apiWithRetry(method, url, data, config, retries - 1);
    }
    throw err;
  }
}

// hiện mã lỗi + thời gian chờ thật, để còn chẩn đoán khi có lỗi
export function friendlyErrorMessage(err) {
  if (!err.response) {
    const ms = err._elapsedMs ?? 0;
    const isSlowTimeout = err.code === "ECONNABORTED" || ms > 15000;
    const detail = `[mã lỗi: ${err.code || "?"} · ${err.message || "?"} · đã chờ ${Math.round(ms / 1000)}s]`;
    if (isSlowTimeout) {
      return `Máy chủ phản hồi quá chậm (đã chờ ${Math.round(ms / 1000)}s) — có thể do server đang khởi động lại. ${detail}`;
    }
    return `Không kết nối được tới máy chủ NGAY LẬP TỨC (không phải do chờ lâu) — nhiều khả năng do cấu hình CORS hoặc backend đang gặp sự cố, không phải do "ngủ đông". ${detail}`;
  }
  return err.response?.data?.message || err.message || "Có lỗi không xác định xảy ra.";
}

// fetch dùng ở Server Components — revalidate là số giây được cache trước khi lấy
// dữ liệu mới, giúp trang tải nhanh hơn, đổi lại sửa nội dung có thể chậm hiện vài giây
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
