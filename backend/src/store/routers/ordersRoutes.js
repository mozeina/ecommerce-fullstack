const express = require('express');
const { viewOrders, viewSpecificOrder } = require('../controllers/orderController');

const router = express.Router();

router.get('/', viewOrders);

router.get('/:id', viewSpecificOrder);

module.exports = router;

