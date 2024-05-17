// routes/user.routes.js
const express = require('express');
const router = express.Router();
const users = require('../controllers/loginController');

router.post('/users', users.create);
router.post('/login', users.login); // Add this line

// Add other routes (GET, PUT, DELETE) here

module.exports = router;
