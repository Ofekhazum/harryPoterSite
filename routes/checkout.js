const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');

const checkoutController = require('../controllers/checkout')


router.get('/checkout', ensureAuthenticated, checkoutController.getCheckoutPage);

router.post('/checkout', ensureAuthenticated, checkoutController.postNewOrder);

module.exports = router;