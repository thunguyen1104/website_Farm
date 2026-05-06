# 🌿 NaFarm – Nền tảng Thương mại điện tử Nông sản Việt

NaFarm là nền tảng thương mại điện tử chuyên cung cấp **nông sản sạch và đặc sản Việt Nam**, kết nối trực tiếp giữa **nông trại và người tiêu dùng**.

Hệ thống tích hợp **mã QR truy xuất nguồn gốc**, giúp đảm bảo tính minh bạch và chất lượng sản phẩm.

🔗 **Demo**: https://website-farm.onrender.com

---

## ✨ Tính năng

### 👤 Module khách hàng

* Đăng ký / đăng nhập (JWT)
* Tìm kiếm & lọc sản phẩm
* Xem chi tiết + QR truy xuất
* Giỏ hàng (CRUD)
* Thanh toán mô phỏng (COD, VNPay, MoMo)
* Lịch sử đơn hàng
* Đánh giá sản phẩm
* Đăng ký gói định kỳ

---

### 🛠️ Module quản trị

* Dashboard (doanh thu, đơn hàng)
* Quản lý sản phẩm
* Quản lý danh mục
* Quản lý đơn hàng
* Quản lý người dùng

---

## 🧰 Công nghệ sử dụng

| Thành phần | Công nghệ           |
| ---------- | ------------------- |
| Backend    | Node.js, Express.js |
| Frontend   | EJS, HTML, CSS, JS  |
| Database   | MongoDB Atlas       |
| Xác thực   | JWT                 |
| Deploy     | Render              |

---

## 📁 Cấu trúc thư mục

```bash
nafarm-ecommerce/
├── config/
├── middleware/
├── models/
├── routes/
├── views/
│   ├── partials/
│   └── pages/
├── public/
├── .env
├── server.js
└── package.json
```

---

## 🚀 Hướng dẫn cài đặt chi tiết

### Yêu cầu

* **Node.js** >= 16 ([Tải tại https://nodejs.org](https://nodejs.org))
* **MongoDB** (sử dụng MongoDB Atlas – dịch vụ cloud miễn phí)
* Git

---

### Bước 1: Clone repository

```bash
git clone https://github.com/thunguyen1104/website_Farm.git
cd website_Farm
```

---

### Bước 2: Cài đặt dependencies

```bash
npm install
```

---

### Bước 3: Tạo file `.env`

Tạo một file tên `.env` trong thư mục gốc của dự án:

```bash
touch .env
```

Thêm nội dung sau vào file `.env`:

```env
# Server Port
PORT=3000

# MongoDB Connection String
# Lấy từ MongoDB Atlas (hướng dẫn ở dưới)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/nafarm-db?retryWrites=true&w=majority

# JWT Secret Key (sinh ra bất kỳ chuỗi ngẫu nhiên nào, tối thiểu 32 ký tự)
JWT_SECRET=your_very_secret_key_change_this_to_random_string_12345

# Session Secret
SESSION_SECRET=your_session_secret_key_random_string_67890

# Google OAuth (nếu muốn tích hợp đăng nhập Google)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
```

---

### Bước 4: Cấu hình MongoDB Atlas

1. Truy cập [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Đăng ký tài khoản miễn phí
3. Tạo một Cluster (chọn gói Free M0)
4. Vào **Database Access** → Tạo user mới với username + password
5. Vào **Network Access** → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
6. Vào **Clusters** → Click **Connect** → Chọn **Connect your application**
7. Copy connection string và dán vào `MONGO_URI` trong `.env`
8. Thay `<username>` và `<password>` bằng thông tin user vừa tạo

**Ví dụ:**
```
mongodb+srv://admin:password123@nafarm-cluster.mongodb.net/nafarm-db?retryWrites=true&w=majority
```

---

### Bước 5: Cấu hình Google OAuth (tùy chọn)

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới
3. Vào **APIs & Services** → **Credentials**
4. Tạo **OAuth 2.0 Client ID** (loại Web application)
5. Thêm **Authorized redirect URIs**: `http://localhost:3000/auth/google/callback`
6. Copy `Client ID` và `Client Secret` vào `.env`

---

### Bước 6: Seed dữ liệu (tùy chọn)

Để thêm dữ liệu mẫu vào database:

```bash
npm run seed
```

---

### Bước 7: Chạy ứng dụng

**Development mode** (tự động reload khi có thay đổi):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

---

### 🎉 Ứng dụng đang chạy

👉 **Local:** http://localhost:3000

---

### 👤 Tài khoản Admin (mặc định)

- **Email:** admin@nafarm.test
- **Mật khẩu:** 123456

⚠️ **Lưu ý:** Đổi mật khẩu admin ngay sau khi đăng nhập lần đầu!

---

### 🐛 Troubleshooting

**Lỗi: `MONGO_URI is not defined`**
- Kiểm tra file `.env` đã tạo chưa và nó phải ở thư mục gốc (cùng cấp với `server.js`)
- Kiểm tra xem connection string MongoDB có chính xác không

**Lỗi: `Port 3000 already in use`**
- Cổng 3000 đã được sử dụng. Thay đổi `PORT` trong `.env`:
```env
PORT=3001
```

**Lỗi: `Cannot connect to MongoDB`**
- Kiểm tra IP Address đã được Allow trong MongoDB Atlas chưa
- Kiểm tra username/password trong connection string

**Lỗi: Không thấy dữ liệu sau khi chạy ứng dụng**
- Chạy lệnh seed để thêm dữ liệu mẫu:
```bash
npm run seed
```
---

## 👥 Nhóm phát triển

* Bùi Hương Giang
* Nguyễn Thị Anh Thư
* Phạm Thị Thùy An
* Nguyễn Hoàng Ánh Thi

---

## 📌 Hướng phát triển

* Đăng nhập Google
* Thanh toán thật
* Testing tự động

---

## 📄 License

Dự án phục vụ mục đích học tập.
