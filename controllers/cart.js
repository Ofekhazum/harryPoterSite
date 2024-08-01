
const Order = require('../models/order');
const mongoose = require('mongoose');
const { getProductsWishlist } = require('../controllers/product');


const getCartPage = async (req, res) => {
    const cartItems = req.session.cart || [];
    
    const productIds = cartItems.map(item => new mongoose.Types.ObjectId(item.productId));

    const products = await getProductsWishlist(productIds);

    const productsWithQuantity = products.map(product => {
      const cartItem = cartItems.find(item => item.productId === product._id.toString());
      return {
        ...product,
        quantity: cartItem ? cartItem.quantity : 0,
        size: cartItem&& cartItem.size,
      };
    });


    const limit = parseInt(req.query.limit) || 3;
    const currentPage = parseInt(req.query.page) || 1;
    const totalItems = productsWithQuantity.length;
    const totalPages = Math.ceil(totalItems / limit);

    const paginatedProducts = productsWithQuantity.slice((currentPage - 1) * limit, currentPage * limit);

    const totalPrice = productsWithQuantity.reduce((acc, product) => acc + (product.price * product.quantity), 0);


    res.render('cart', {
        cart: paginatedProducts,
        totalItems,
        totalPrice,
        currentPage,
        totalPages,
        limit,
        user: req.user
    });
}

const addCartItem = async (req, res) => {
    const { productId, quantity, price, category, size, productName } = req.body;
    const cart = req.session.cart || [];
  
    const existingItemIndex = cart.findIndex(item => item.productId === productId);
    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += parseInt(quantity);
    } else {
      cart.push({ productId, quantity: parseInt(quantity), price: parseInt(price), category, size, productName });
    }
  
    req.session.cart = cart;
    res.json({ success: true });
}

const updateCartItem = async (req, res) => {
    const { productId, quantity } = req.body;
    const cart = req.session.cart || [];
  
    const existingItemIndex = cart.findIndex(item => item.productId === productId);
    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity = parseInt(quantity);
    }
  
    req.session.cart = cart;
    res.redirect('/cart');
}

const removeCartItem = async (req, res) => {
    const { productId } = req.body;
    let cart = req.session.cart || [];
  
    cart = cart.filter(item => item.productId !== productId);
  
    req.session.cart = cart;
    res.redirect('/cart');
}

module.exports = {getCartPage, addCartItem, updateCartItem, removeCartItem}