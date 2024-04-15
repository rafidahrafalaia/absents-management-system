const express = require('express');
const router = express.Router();
const admin = require('../controllers/admin');
const validation = require('../middleware/validation');

const multer = require('multer');
const path = require('path');

// Create a storage for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'C:/Users/62813/Documents/Code/admin-app/public/uploads'); // Directory where files will be saved
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); // Rename file
    },
});


// Create multer instances for each storage configuration
const upload1 = multer({ storage: storage });

// Route to handle file uploads
router.post('/upload/:id', validation.authenticateToken, validation.isAdmin, upload1.single('avatar'), admin.upload);
router.post('/register', validation.authenticateToken, validation.isAdmin, admin.registerUser)
router.get('/readAll', validation.authenticateToken, validation.isAdmin, admin.readAllUser);
router.get('/read/:id', validation.authenticateToken, validation.isAdmin, admin.readUser);
router.put('/update/:id', validation.authenticateToken, validation.isAdmin, admin.updateUser);
router.get('/getAllAbsents', validation.authenticateToken, validation.isAdmin, admin.getAllAbsents);
module.exports = router