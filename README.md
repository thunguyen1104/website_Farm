# 🌿 NaFarm – Đặc Sản Việt Nam (E-commerce)

NaFarm là nền tảng thương mại điện tử chuyên về nông sản và thực phẩm sạch, kết nối trực tiếp nông trại với người tiêu dùng. Sản phẩm bao gồm trái cây sấy, hạt dinh dưỡng, trà thảo mộc và các gói đặt hàng định kỳ (subscription). Hệ thống tích hợp mã QR truy xuất nguồn gốc, giúp khách hàng kiểm tra thông tin sản phẩm một cách minh bạch.

🔗 **Deploy trên Render**: https://website-farm.onrender.com

## ✨ Tính năng chính

### 👤 Module khách hàng
- Đăng ký / đăng nhập (JWT, có thể mở rộng OAuth Google)
- Tìm kiếm và lọc sản phẩm theo danh mục, giá, nguồn gốc
- Xem chi tiết sản phẩm với mã QR truy xuất nguồn gốc
- Giỏ hàng (thêm/xóa/sửa số lượng)
- Thanh toán mô phỏng (COD, VNPay, MoMo – demo)
- Lịch sử đơn hàng
- Đánh giá sản phẩm (sao + bình luận)
- Đăng ký gói đặt hàng định kỳ (subscription)

### 🛠️ Module quản trị (Admin)
- Dashboard tổng quan: doanh thu, đơn hàng, sản phẩm bán chạy
- Quản lý sản phẩm: thêm, sửa, xóa, xem danh sách
- Quản lý danh mục
- Quản lý đơn hàng (cập nhật trạng thái)
- Quản lý người dùng (phân quyền)

## 🧰 Công nghệ sử dụng

- **Backend**: Node.js, Express.js
- **Frontend**: EJS (template engine), HTML5, CSS3, JavaScript thuần
- **Database**: MongoDB (MongoDB Atlas)
- **Xác thực**: JSON Web Token (JWT), HTTP‑only cookie
- **Bảo mật**: bcryptjs, express-session, helmet (tuỳ chọn)
- **Deploy**: Render.com (PaaS)

## 📁 Cấu trúc thư mục chính
nafarm-ecommerce/
├── config/ # Cấu hình database, passport
├── middleware/ # Xác thực JWT, phân quyền admin
├── models/ # Mongoose models (User, Product, Order...)
├── routes/ # Định tuyến API và trang
├── views/ # Template EJS
│ ├── partials/ # Header, footer, head
│ └── pages/ # about, contact, admin
├── public/ # File tĩnh (CSS, JS, images)
├── .env # Biến môi trường (không push lên git)
├── server.js # Entry point
└── package.json

text

## 🚀 Hướng dẫn cài đặt và chạy local

### Yêu cầu
- Node.js (v16 trở lên)
- MongoDB (local hoặc Atlas)
- Tài khoản MongoDB Atlas (miễn phí)

### Các bước

1. **Clone repository**
   ```bash
   https://github.com/thunguyen1104/website_Farm.git
   
Cài đặt dependencies

bash
npm install
Tạo file .env (dựa vào mẫu .env.example)

env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster....mongodb.net/nafarm_db
JWT_SECRET=your_secret_key
SESSION_SECRET=another_secret
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
Chạy ứng dụng

Môi trường phát triển (tự động reload):

bash
npm run dev
Môi trường production:

bash
npm start
Truy cập: http://localhost:3000

🔐 Biến môi trường (Environment Variables)
Tên biến	Mô tả	Bắt buộc
PORT	Cổng chạy server (Render sẽ gán động)	Không
MONGO_URI	Chuỗi kết nối MongoDB Atlas	Có
JWT_SECRET	Khóa bí mật dùng để ký JWT	Có
SESSION_SECRET	Khóa bí mật cho session	Có
GOOGLE_CLIENT_ID	Client ID từ Google Cloud Console (nếu dùng OAuth)	Không
GOOGLE_CLIENT_SECRET	Client secret tương ứng	Không
📦 Dữ liệu mẫu
Sau khi kết nối database thành công, bạn có thể tự thêm sản phẩm qua giao diện admin hoặc dùng script seed (nếu có). Tài khoản admin mặc định (nếu chưa có) cần được tạo thủ công trong database với role: 'admin'.

🧪 Kiểm thử và deploy
Local test: npm run dev → mở http://localhost:3000

Deploy lên Render: Kết nối GitHub repository, đặt Build Command npm install, Start Command npm start, thêm đầy đủ biến môi trường.

👥 Nhóm phát triển
Bùi Hương Giang

Nguyễn Thị Anh Thư

Phạm Thị Thùy An

Nguyễn Hoàng Ánh Thi
