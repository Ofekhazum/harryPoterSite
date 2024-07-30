// routes/wishlist.js
const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const { ensureAuthenticated } = require('../middleware/auth');
const {getProductsWishlist} = require('../controllers/product');

// Get wishlist items
router.get('/wishlist', ensureAuthenticated, async (req, res) => {
  const wishlist = req.session.wishlist || [];
  const products = await getProductsWishlist(wishlist);
  res.render('wishlist', { products });
});

// Add item to wishlist
router.post('/wishlist/add/:id', ensureAuthenticated, (req, res) => {
  const productId = req.params.id;
  
  if (!req.session.wishlist) {
    req.session.wishlist = [];
  }
  if (!req.session.wishlist.includes(productId)) {
    req.session.wishlist.push(productId);
  }
  res.redirect('back');
});

// Remove item from wishlist
router.post('/wishlist/remove', ensureAuthenticated, (req, res) => {
  // const productId = req.params.id;
  const { productId } = req.body;
  req.session.wishlist = req.session.wishlist.filter(id => id !== productId);
  res.redirect('back');
});

module.exports = router;
