const express = require('express');
const usersController = require('./users.controller');
const router = express.Router();
router.post('/signup', usersController.user_signup);
router.post('/login', usersController.userLogin);
module.exports = router;