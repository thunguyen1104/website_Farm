require('dotenv').config();
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');

const sampleCategories = [
  { name: 'Sấy Dẻo', slug: 'say-deo', emoji: '🥭', color: 'g' },
  { name: 'Sấy Giòn', slug: 'say-gion', emoji: '🍓', color: 'b' },
  { name: 'Hạt & Ngũ Cốc', slug: 'hat', emoji: '🌰', color: 'y' },
  { name: 'Trái Tươi Việt Nam', slug: 'tuoi', emoji: '🍊', color: 's' },
  { name: 'Trái Nhập Khẩu', slug: 'nk', emoji: '🫐', color: 'p' },
  { name: 'Trà & Thức Uống', slug: 'tra', emoji: '🍵', color: 'r' }
];

const sampleProducts = [
  { name: 'Xoài Sấy Dẻo Đà Lạt', emoji: '🥭', price: 85000, oldPrice:110000, origin:'Đà Lạt', category:'say-deo', badges:['sale'], rating:4.8, reviewsCount:124, description:'Ngọt tự nhiên, không phẩm màu.', tags:['Không đường','Vitamin C'], story:'Thu hoạch từ vườn xoài 20 năm tuổi.', stock:56 },
  { name: 'Dâu Tây Sấy Giòn', emoji: '🍓', price: 92000, origin:'Đà Lạt', category:'say-gion', badges:['new'], rating:4.9, reviewsCount:89, description:'Giòn tan, chua ngọt tự nhiên.', tags:['Organic','Vitamin C'], story:'Dâu tây hái buổi sáng sớm.', stock:32 },
  { name: 'Hạt Điều Rang Muối', emoji: '🥜', price: 145000, origin:'Bình Phước', category:'hat', badges:['hot'], rating:4.7, reviewsCount:201, description:'Rang tay, giòn đều và thơm.', tags:['Protein','Không GMO'], story:'Điều thô hữu cơ từ Bình Phước.', stock:98 },
  { name: 'Chuối Sấy Dẻo Tiền Giang', emoji: '🍌', price: 65000, oldPrice:85000, origin:'Tiền Giang', category:'say-deo', badges:['sale'], rating:4.6, reviewsCount:156, description:'Dẻo mềm, đậm đà vị ngọt.', tags:['Kali','Năng lượng'], story:'Chuối sứ chín 100% trên cây.', stock:45 },
  { name: 'Trái Cây Tươi Mix Đà Lạt', emoji: '🍒', price: 180000, origin:'Đà Lạt', category:'tuoi', badges:['new'], rating:5.0, reviewsCount:67, description:'Hộp 5–7 loại, hái sáng giao chiều.', tags:['Tươi ngày','Organic'], story:'Đặt trước 10h, giao trong ngày.', stock:12 },
  { name: 'Óc Chó Hữu Cơ California', emoji: '🫘', price: 220000, origin:'USA', category:'hat', badges:['organic'], rating:4.8, reviewsCount:93, description:'Omega-3, USDA Organic.', tags:['Omega-3','USDA Organic'], story:'Nhập từ Sacramento Valley, CA.', stock:27 },
  { name: 'Kiwi Sấy Giòn New Zealand', emoji: '🥝', price: 115000, origin:'New Zealand', category:'say-gion', badges:['new'], rating:4.7, reviewsCount:78, description:'Chua ngọt hài hòa.', tags:['Vitamin C','Chất xơ'], story:'Kiwi Zespri SunGold.', stock:41 },
  { name: 'Trà Atiso Đà Lạt', emoji: '🌺', price: 78000, origin:'Đà Lạt', category:'tra', badges:['new'], rating:4.9, reviewsCount:142, description:'Thanh lọc cơ thể, mát gan.', tags:['Giải độc','Mát gan'], story:'Atiso phơi sấy tự nhiên.', stock:89 },
  { name: 'Bơ Sấy Giòn Đắk Lắk', emoji: '🥑', price: 95000, oldPrice:120000, origin:'Đắk Lắk', category:'say-gion', badges:['sale'], rating:4.6, reviewsCount:88, description:'Béo bùi tự nhiên.', tags:['Omega-9','Béo lành'], story:'Bơ 034 thu hoạch đúng độ chín.', stock:63 },
  { name: 'Hạt Macadamia Úc', emoji: '🌰', price: 285000, origin:'Australia', category:'hat', badges:['organic'], rating:4.9, reviewsCount:112, description:'Bùi béo, từ Queensland.', tags:['Omega-7','Premium'], story:'Thu hoạch thủ công Queensland.', stock:19 },
  { name: 'Táo Sấy Dẻo Đà Lạt', emoji: '🍏', price: 72000, origin:'Đà Lạt', category:'say-deo', badges:['hot'], rating:4.5, reviewsCount:64, description:'Táo Anna Đà Lạt sấy dẻo.', tags:['Pectin','Vitamin A'], story:'Táo Anna vùng cao Đà Lạt.', stock:74 },
  { name: 'Trà Ô Long Bảo Lộc', emoji: '🍵', price: 88000, origin:'Lâm Đồng', category:'tra', badges:['new'], rating:4.8, reviewsCount:99, description:'Ô long thượng hạng.', tags:['Polyphenol','Cao cấp'], story:'Hái tay từ đồi trà 50 năm.', stock:51 }
];

async function seed() {
  try {
    await connectDB();
    // Clear existing
    await Category.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Insert categories
    const cats = await Category.insertMany(sampleCategories);
    console.log(`Inserted ${cats.length} categories`);

    // Insert products
    const prods = await Product.insertMany(sampleProducts.map(p => ({
      name: p.name,
      emoji: p.emoji,
      price: p.price,
      oldPrice: p.oldPrice,
      origin: p.origin,
      category: p.category,
      badges: p.badges || [],
      rating: p.rating || 0,
      reviewsCount: p.reviewsCount || 0,
      description: p.description || '',
      tags: p.tags || [],
      story: p.story || '',
      stock: p.stock || 100
    })));
    console.log(`Inserted ${prods.length} products`);

    // Create admin user
    const admin = new User({ name: 'Admin', email: 'admin@nafarm.test', password: '123456', role: 'admin' });
    await admin.save();
    console.log('Created admin user: admin@nafarm.test (password: 123456)');

    console.log('Seeding completed.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
