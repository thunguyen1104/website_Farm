const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');

// Lấy danh sách đơn hàng của user hiện tại
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort('-createdAt');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tạo đơn hàng mới (checkout)
router.post('/', auth, async (req, res) => {
  try {
    const { items, total, shippingFee, address, paymentMethod } = req.body;
    const order = new Order({
      userId: req.user.id,
      items,
      total,
      shippingFee,
      address,
      paymentMethod,
      status: 'pending'
    });
    await order.save();
    res.json({ success: true, orderId: order._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cập nhật trạng thái đơn hàng (cho admin)
router.put('/:id/status', auth, require('../middleware/admin'), async (req, res) => {
  try {
    const { status } = req.body;
    await Order.findByIdAndUpdate(req.params.id, { status });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;