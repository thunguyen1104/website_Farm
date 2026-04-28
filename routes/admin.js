const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const User = require('../models/User');

// Middleware admin cho tất cả route
router.use(auth, admin);

// Dashboard
router.get('/', (req, res) => {
  res.render('pages/admin', { user: req.user });
});

// API lấy thống kê
router.get('/stats', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]);
    const totalUsers = await User.countDocuments();
    const recentOrders = await Order.find().sort('-createdAt').limit(5).populate('userId', 'name');
    res.json({ totalOrders, totalRevenue: totalRevenue[0]?.total || 0, totalUsers, recentOrders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CRUD sản phẩm
router.get('/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

router.post('/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tương tự cho categories, orders, users...

module.exports = router;