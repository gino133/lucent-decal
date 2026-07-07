# Lucent Glass — Website + CMS Quản Trị

Hệ thống website bán hàng/giới thiệu công ty **decal kính & kiến trúc kính**, xây dựng lại từ 9 file layout gốc (`01_home_page_desktop.html` → `07_gio_hang_desktop.html`), có trang quản trị (CMS) để **quản lý toàn bộ nội dung, hình ảnh, menu, màu sắc, font chữ, sản phẩm, dự án, đơn hàng ngay trên web** — không cần sửa code, giống WordPress.

## 1. Kiến trúc hệ thống

```
lucent-glass/
├── backend/     Node.js + Express + MongoDB (Mongoose) — REST API + CMS API
└── frontend/    Next.js (App Router) + Tailwind CSS — giao diện công khai + trang /admin
```

| Thành phần        | Công nghệ                          | Nơi deploy      |
|--------------------|-------------------------------------|-----------------|
| Giao diện website  | Next.js 14 (React)                  | **Vercel**      |
| API + CMS backend  | Node.js / Express / Mongoose        | **Render**      |
| Cơ sở dữ liệu      | MongoDB                             | **MongoDB Atlas** |
| Lưu trữ hình ảnh   | Cloudinary                          | Cloudinary      |
| Thanh toán online  | VNPay (sandbox/production)          | VNPay           |
| Mã nguồn           | Git                                  | **GitHub**      |

Toàn bộ nội dung hiển thị ngoài site (banner trang chủ, giới thiệu, hồ sơ năng lực, liên hệ, sản phẩm, dự án, menu, màu sắc, font, logo...) đều được lưu trong MongoDB và chỉnh sửa qua trang `/admin` — khi admin lưu thay đổi, website cập nhật ngay (không cần deploy lại).

---

## 2. Cài đặt & chạy thử ở máy local

### Yêu cầu
- Node.js 18+
- Tài khoản MongoDB Atlas (miễn phí) → lấy connection string
- Tài khoản Cloudinary (miễn phí) → lấy Cloud name, API key, API secret
- (Tuỳ chọn) Tài khoản VNPay Sandbox: https://sandbox.vnpayment.vn để test thanh toán

### Bước 1 — Backend

```bash
cd backend
cp .env.example .env
# Mở file .env, điền MONGODB_URI, JWT_SECRET, CLOUDINARY_*, VNP_*
npm install
npm run seed     # tạo tài khoản admin + dữ liệu mẫu (menu, trang, sản phẩm, dự án...)
npm run dev      # chạy tại http://localhost:5000
```

Tài khoản admin mặc định (đặt trong `.env`):
- Email: `ADMIN_EMAIL` (mặc định `admin@lucentglass.vn`)
- Mật khẩu: `ADMIN_PASSWORD` (mặc định `Admin@123456`) — **hãy đổi ngay sau khi đăng nhập lần đầu**

### Bước 2 — Frontend

```bash
cd frontend
cp .env.local.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:5000/api
npm install
npm run dev      # chạy tại http://localhost:3000
```

Truy cập:
- Website: http://localhost:3000
- Trang quản trị: http://localhost:3000/admin/dang-nhap

---

## 3. Triển khai lên GitHub

```bash
cd lucent-glass
git init
git add .
git commit -m "Khởi tạo website Lucent Glass"
git branch -M main
git remote add origin https://github.com/<ten-tai-khoan>/<ten-repo>.git
git push -u origin main
```

> Lưu ý: `.env` và `.env.local` đã được đưa vào `.gitignore`, sẽ **không** bị đẩy lên GitHub. Bạn sẽ khai báo các biến môi trường trực tiếp trên Render/Vercel ở bước dưới.

---

## 4. Triển khai Backend lên Render

1. Đăng nhập https://render.com → **New** → **Web Service** → chọn repo GitHub vừa đẩy lên.
2. Cấu hình:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (hoặc trả phí nếu cần luôn hoạt động, vì gói Free sẽ "ngủ" sau 15 phút không dùng)
3. Vào tab **Environment**, thêm toàn bộ biến trong `backend/.env.example`:
   - `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL` (điền domain Vercel sau khi có ở bước 5),
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`,
   - `VNP_TMN_CODE`, `VNP_HASH_SECRET`, `VNP_URL`, `VNP_RETURN_URL` (domain Vercel + `/checkout/vnpay-return`),
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
4. Deploy. Sau khi chạy thành công, mở **Shell** của Render (hoặc chạy 1 lần qua Render Job) và gõ `npm run seed` để tạo tài khoản admin + dữ liệu mẫu.
5. Ghi lại URL backend, ví dụ: `https://lucent-glass-backend.onrender.com`

(File `render.yaml` ở thư mục gốc cũng có thể dùng để triển khai tự động qua **Render Blueprints**.)

---

## 5. Triển khai Frontend lên Vercel

1. Đăng nhập https://vercel.com → **Add New Project** → chọn repo GitHub.
2. **Root Directory**: `frontend`
3. Framework Preset: Next.js (tự nhận diện)
4. Environment Variables:
   - `NEXT_PUBLIC_API_URL` = `https://lucent-glass-backend.onrender.com/api` (URL backend ở bước 4)
5. Deploy. Vercel sẽ cấp cho bạn 1 domain dạng `https://ten-du-an.vercel.app` (có thể gắn domain riêng trong tab Domains).
6. Quay lại Render, cập nhật biến `CLIENT_URL` và `VNP_RETURN_URL` bằng domain Vercel thật, sau đó **redeploy backend**.

---

## 6. Cấu hình MongoDB Atlas

1. Tạo Cluster miễn phí (M0) tại https://cloud.mongodb.com
2. Database Access → tạo user + mật khẩu
3. Network Access → Add IP `0.0.0.0/0` (cho phép Render kết nối)
4. Lấy Connection String dạng:
   `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/lucentglass?retryWrites=true&w=majority`
   → dán vào biến `MONGODB_URI`

## 7. Cấu hình Cloudinary (lưu ảnh do admin tải lên)

1. Tạo tài khoản miễn phí tại https://cloudinary.com
2. Dashboard → lấy **Cloud name**, **API Key**, **API Secret**
3. Dán vào biến môi trường backend tương ứng

## 8. Cấu hình VNPay (thanh toán online)

1. Đăng ký tài khoản merchant Sandbox tại https://sandbox.vnpayment.vn/apis/ để lấy `vnp_TmnCode` và `vnp_HashSecret` dùng thử nghiệm.
2. Khi đã sẵn sàng vận hành thật, đăng ký tài khoản merchant chính thức với VNPay để lấy bộ mã sản xuất, đổi `VNP_URL` sang `https://pay.vnpay.vn/vpcpay.html`.
3. `VNP_RETURN_URL` phải trỏ về `https://<domain-frontend>/checkout/vnpay-return`.
4. Thẻ test Sandbox: xem tại https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html (mục "Danh sách ngân hàng hỗ trợ test").

---

## 9. Hướng dẫn sử dụng trang quản trị (CMS)

Truy cập `https://<domain-frontend>/admin/dang-nhap`, đăng nhập bằng tài khoản đã tạo ở bước seed.

| Mục trong CMS | Chức năng |
|---|---|
| **Tổng quan** | Xem nhanh số lượng sản phẩm / dự án / đơn hàng / liên hệ mới |
| **Nội dung trang** | Chỉnh từng khối nội dung (banner, văn bản, ảnh, số liệu, CTA...) của Trang chủ, Giới thiệu, Hồ sơ năng lực, Liên hệ — kéo thả thứ tự, ẩn/hiện từng khối |
| **Menu điều hướng** | Thêm / sửa / xoá / sắp xếp các mục trên thanh menu chính |
| **Sản phẩm** | Thêm/sửa/xoá sản phẩm, giá, ảnh, thông số kỹ thuật, đánh dấu nổi bật |
| **Dự án** | Thêm/sửa/xoá dự án đã thực hiện, ảnh, thông tin khách hàng |
| **Đơn hàng** | Xem danh sách đơn hàng, trạng thái thanh toán VNPay, cập nhật trạng thái xử lý |
| **Liên hệ** | Xem các yêu cầu tư vấn khách gửi từ form Liên hệ |
| **Giao diện & Cài đặt** | Đổi logo, **màu sắc thương hiệu**, **font chữ**, thông tin liên hệ, mạng xã hội, cấu hình phí vận chuyển/VAT |

Mọi thay đổi lưu vào MongoDB và hiển thị ngay trên website (do trang được render `no-store`, luôn lấy dữ liệu mới nhất).

---

## 10. Responsive

Toàn bộ giao diện dùng Tailwind CSS với breakpoint chuẩn (`md:`) tương ứng tablet trở lên; dưới `md` tự động chuyển bố cục 1 cột/lưới rút gọn, menu chính chuyển thành menu hamburger trên mobile. Đã kiểm thử bố cục ở 3 kích thước: mobile (~375px), tablet (~768px), desktop (≥1280px).

---

## 11. Ghi chú kỹ thuật quan trọng

- **Gói Free của Render sẽ "ngủ"** sau ~15 phút không có truy cập, request đầu tiên sau đó sẽ chậm (cold start ~30–60s). Nếu cần luôn nhanh, nâng cấp gói trả phí.
- **Ảnh phải upload qua trang quản trị** (dùng nút "Tải ảnh lên" ở các form) để lưu bền vững trên Cloudinary — không dùng ảnh từ máy tính dán trực tiếp đường dẫn local.
- Sau khi seed dữ liệu mẫu, hãy vào từng mục CMS để **thay bằng nội dung / hình ảnh thật** của công ty bạn.
- Đổi mật khẩu admin ngay sau lần đăng nhập đầu tiên (gọi API `PUT /api/auth/change-password` hoặc bổ sung màn hình đổi mật khẩu nếu cần).
