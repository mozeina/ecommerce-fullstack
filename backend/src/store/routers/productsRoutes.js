const { viewProducts, viewSpecificProduct } = require('../controllers/productController');

const express = require('express');

const router = express.Router();

//ALL ITEMS ARE VIEWED AUTOMATICALLY
router.get('/', viewProducts);

//TO VIEW SPECIFIC PRODUCT
router.get('/:id', viewSpecificProduct);

module.exports = router;