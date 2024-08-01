// routes/user.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersManagement');
const { ensureAdmin } = require('../middleware/auth');

router.get('/users-management', ensureAdmin, userController.getUserManagement);
router.post('/users-management', ensureAdmin, userController.addUser);
router.post('/users-management/:id', ensureAdmin, userController.updateUser);
router.post('/users-management/:id/delete', ensureAdmin, userController.deleteUser);

module.exports = router;
