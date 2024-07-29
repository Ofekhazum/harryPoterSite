const express = require('express');
const router = express.Router();
const charectersController = require('../controllers/charecters');
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/charecters',charectersController.getCharectersPage);





module.exports = router;
