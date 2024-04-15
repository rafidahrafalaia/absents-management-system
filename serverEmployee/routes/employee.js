const express = require('express');
const router = express.Router();
const employee = require('../controllers/employee');
const validation = require('../middleware/validation');

const multer = require('multer');
const path = require('path');

// Create a storage for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'C:/Users/62813/Documents/Code/employee/public/uploads'); // Directory where files will be saved
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); // Rename file
    },
});

const upload = multer({ storage });

// Route to handle file uploads
router.post('/upload', validation.authenticateToken, validation.isEmployee, upload.single('avatar'), employee.upload);  
router.get('/read', validation.authenticateToken, validation.isEmployee, employee.readUser);
router.put('/update', validation.authenticateToken, validation.isEmployee, employee.updateUser);
router.post('/clockin', validation.authenticateToken, validation.isEmployee, employee.clockin);
router.post('/clockout', validation.authenticateToken, validation.isEmployee, employee.clockout);
router.get('/getAbsents', validation.authenticateToken, validation.isEmployee, employee.getAbsents);
module.exports = router