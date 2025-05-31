const express = require('express');
const adminController = require('./admin.controller');
const router = express.Router();
router.get('/login', adminController.adminLogin);
module.exports = router;