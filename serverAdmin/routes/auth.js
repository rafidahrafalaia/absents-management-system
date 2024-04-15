const express = require('express');
const router = express.Router();
const authControllers = require('../Controllers/auth');

router.post('/login',  authControllers.loginUser)

module.exports = router