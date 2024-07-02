const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { checkout } = require('../controllers/checkoutController');


router.get('/', authenticateToken, checkout);


module.exports = router;

