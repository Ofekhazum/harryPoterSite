
const express = require('express');
const axios = require('axios');
const router = express.Router();
const spellsController = require('../controllers/spells');

router.get('/spells', spellsController.getSpellsFromApi);

module.exports = router;
