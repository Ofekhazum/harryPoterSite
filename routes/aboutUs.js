const express = require('express');
const router = express.Router();
const aboutUsController = require('../controllers/aboutUs');

router.get('/about-us',aboutUsController.getAboutUsPage);


module.exports = router;
