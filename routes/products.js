const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Review = require('../models/Review');

// Lấy danh sách sản phẩm (có filter, search, sort)
router.get('/', async (req, res) => {
  try {
    const { cat, search, sort } = req.query;
    let filter = {};
    if (cat && cat !== 'all') filter.category = cat;
    if (search) filter.name = { $regex: search, $options: 'i' };
    let query = Product.find(filter);
    if (sort === 'price-asc') query = query.sort('price');
    else if (sort === 'price-desc') query = query.sort('-price');
    else if (sort === 'rating') query = query.sort('-rating');
    else query = query.sort('-createdAt');
    const products = await query.exec();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Chi tiết sản phẩm + reviews
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    const reviews = await Review.find({ productId: product._id }).populate('userId', 'name');
    res.json({ product, reviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Đánh giá sản phẩm (yêu cầu đăng nhập)
router.post('/:id/reviews', require('../middleware/auth'), async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
    const review = new Review({
      userId: req.user.id,
      productId: product._id,
      rating,
      comment
    });
    await review.save();
    // Cập nhật rating trung bình
    const allReviews = await Review.find({ productId: product._id });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    product.rating = avg;
    product.reviewsCount = allReviews.length;
    await product.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;