const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const cartController = require('../controllers/cart');


router.get('/cart', ensureAuthenticated, cartController.getCartPage);

router.post('/cart/add', ensureAuthenticated, cartController.addCartItem);
  
router.post('/cart/update', ensureAuthenticated, cartController.updateCartItem);
  
router.post('/cart/remove', ensureAuthenticated, cartController.removeCartItem);

module.exports = router;
