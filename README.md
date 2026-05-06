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

## 🚀 Hướng dẫn cài đặt

### Yêu cầu

* Node.js >= 16
* MongoDB

---

### Cài đặt

```bash
git clone https://github.com/thunguyen1104/website_Farm.git
cd website_Farm
npm install
```

---

### Tạo file `.env`

```env
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
SESSION_SECRET=your_session_secret
```

---

### Chạy ứng dụng

```bash
npm run dev
npm start
```

👉 http://localhost:3000
### Tài khoản admin
```bash
TĐN: admin@nafarm.test
MK: 123456
```

## 👥 Nhóm phát triển

* Bùi Hương Giang
* Nguyễn Ngọc Anh Thư
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
