const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');

router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    const categories = await Category.find();
    res.render('index', { user: req.user, products, categories });
  } catch (err) {
    res.render('index', { user: req.user, products: [], categories: [] });
  }
});

router.get('/pages/:page', (req, res) => {
  const page = req.params.page;
  res.render(`pages/${page}`, { user: req.user });
});

module.exports = router;