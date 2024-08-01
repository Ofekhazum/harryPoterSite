const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory');
const { ensureAdmin } = require('../middleware/auth');

router.get('/inventory', ensureAdmin, inventoryController.getInventory);
router.post('/inventory/add', ensureAdmin, inventoryController.addProduct);
router.post('/inventory/update/:id', ensureAdmin, inventoryController.updateProduct);
router.post('/inventory/delete/:id', ensureAdmin, inventoryController.deleteProduct);

module.exports = router;
