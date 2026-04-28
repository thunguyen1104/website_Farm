const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  emoji: String,
  price: { type: Number, required: true },
  oldPrice: Number,
  origin: String,
  category: { type: String, required: true }, // say-deo, say-gion, hat, tuoi, tra
  badges: [String],
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  description: String,
  tags: [String],
  story: String,
  stock: { type: Number, default: 100 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);