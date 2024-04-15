const express = require('express');
const router = express.Router();
const employee = require('../controllers/employee');
const validation = require('../middleware/validation');
const dotenv = require('dotenv');
dotenv.config();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${process.env.FILE_PATH}`); // Directory where files will be saved
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); // Rename file
    },
});

const upload = multer({ storage });

router.post('/upload', validation.authenticateToken, validation.isEmployee, upload.single('avatar'), employee.upload);  
router.get('/read', validation.authenticateToken, validation.isEmployee, employee.readUser);
router.put('/update', validation.authenticateToken, validation.isEmployee, employee.updateUser);
router.post('/clockin', validation.authenticateToken, validation.isEmployee, employee.clockin);
router.post('/clockout', validation.authenticateToken, validation.isEmployee, employee.clockout);
router.get('/getAbsents', validation.authenticateToken, validation.isEmployee, employee.getAbsents);
module.exports = router