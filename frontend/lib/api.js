import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// timeout rõ ràng (25s) để phân biệt được 2 tình huống khác nhau:
// - Lỗi NGAY LẬP TỨC (vài trăm ms) -> thường là CORS/kết nối bị chặn, KHÔNG phải do "ngủ đông"
// - Lỗi SAU KHI CHỜ ĐỦ 25s -> đúng là timeout/server phản hồi quá chậm
export const api = axios.create({ baseURL: API_URL, timeout: 25000 });

// Gắn token admin (nếu có) cho các request phía client
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

// Tự thử lại nếu là lỗi mạng/timeout (không có response) — thường do server
// free-tier đang "thức dậy" sau thời gian không hoạt động, không phải lỗi thật.
// Dùng cho các thao tác LƯU quan trọng trong admin (tránh mất công gõ lại nội dung).
export async function apiWithRetry(method, url, data, config, retries = 2) {
  const startedAt = Date.now();
  try {
    return await api[method](url, data, config);
  } catch (err) {
    err._elapsedMs = Date.now() - startedAt; // gắn thời gian đã chờ để chẩn đoán chính xác hơn
    const isNetworkError = !err.response;
    if (isNetworkError && retries > 0) {
      await new Promise((r) => setTimeout(r, 6000));
      return apiWithRetry(method, url, data, config, retries - 1);
    }
    throw err;
  }
}

// Hiện đúng nguyên nhân kỹ thuật (mã lỗi, thời gian đã chờ) thay vì chỉ đoán chung chung,
// để nếu vẫn còn lỗi, thông tin hiện ra đã đủ để xác định chính xác nguyên nhân thật.
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
