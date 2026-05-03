const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  emoji: { type: String, default: '🌿' },
  color: { type: String, default: 'g' }, // g, b, y, s, p, r
  parent: { type: String, default: null }
});

module.exports = mongoose.model('Category', CategorySchema);