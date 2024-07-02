const express = require('express');
const router = express.Router();

const { authenticateToken } = require('../middleware/authMiddleware');

const { viewCart, addToCart, removeFromCart, updateQuantity } = require('../controllers/cartController');

//VIEW CART ON ENTRY
router.get('/', authenticateToken, viewCart);


//ADD ITEM TO CART with id and 
router.post('/addToCart', authenticateToken, addToCart);


//DELETE ITEM FROM CART WITH ID 
router.delete('/removeFromCart/:id', authenticateToken, removeFromCart);

//UPDATE CART ITEM QUANTITY WITH ID
router.put('/updateQuantity', authenticateToken, updateQuantity);

//
module.exports = router;    

