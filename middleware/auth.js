
const {getProductsWishlist} = require('../controllers/product');

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
};

const forwardAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
};

const ensureAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.user_type === 'Admin') {
      return next();
    }
    res.status(403).send('Access denied. Admins only.');
  };
const attachUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        req.user = req.session.passport.user;
      } else {
        req.user = {};
      }
      next();
};

const fetchWishlist = async (req, res, next) => {
    if (req.isAuthenticated()) {
      const wishlist = req.session.wishlist || [];
      const products =   await getProductsWishlist(wishlist);
      res.locals.wishlist = products;
    } else {
      res.locals.wishlist = [];
    }
    next();
  };

module.exports = { ensureAuthenticated, forwardAuthenticated, attachUser, ensureAdmin, fetchWishlist};