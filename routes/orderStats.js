const express = require('express');
const router = express.Router();
const { getTotalRevenue, getTotalOrders, getTotalItemsSold, getTopProducts, getTopCategories } = require('../controllers/orderStats');
const { ensureAdmin } = require('../middleware/auth');

router.get('/statistics', ensureAdmin ,async (req, res) => {
  try {
    const totalRevenue = await getTotalRevenue();
    const totalOrders = await getTotalOrders();
    const totalItemsSold = await getTotalItemsSold();
    const topProducts = await getTopProducts();
    const topCategories = await getTopCategories();

    res.render('statistics', {
      totalRevenue,
      totalOrders,
      totalItemsSold,
      topProducts,
      topCategories,
      user: req.user,
    });
  } catch (err) {
    console.error('Error fetching statistics:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
