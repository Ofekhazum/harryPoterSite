const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile');
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/profile', ensureAuthenticated, profileController.getProfile);
router.post('/profile', ensureAuthenticated, profileController.updateProfile);

router.get('/orders-history', ensureAuthenticated, profileController.getOrdersHistoryPage);

router.get('/admin/orders-history/:id', ensureAuthenticated, profileController.getOrdersHistoryPagAsAdmin);

module.exports = router;
