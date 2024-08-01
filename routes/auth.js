const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');


router.get('/signup', authController.getSignupPage);
router.post('/signup', authController.postSignup);

router.get('/login', authController.getLoginPage);
router.post('/login', authController.postLogin);

router.get('/logout', authController.logout);

module.exports = router;