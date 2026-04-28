const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  try {
    const products = await Product.find().limit(8).sort({ createdAt: -1 });
    res.render('index', { user: req.user, products });
  } catch (err) {
    res.render('index', { user: req.user, products: [] });
  }
});

router.get('/pages/:page', (req, res) => {
  const page = req.params.page;
  res.render(`pages/${page}`, { user: req.user });
});

module.exports = router;