const express = require('express');
const router = express.Router();
const logging = require('../Controllers/device');

router.post('/device', logging.postDevice);
module.exports = router