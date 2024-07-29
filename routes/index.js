const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index');
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/',indexController.getHomePage);





module.exports = router;
