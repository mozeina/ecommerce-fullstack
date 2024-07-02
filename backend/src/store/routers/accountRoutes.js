const express = require('express');
const { changePassword } = require('../controllers/accountController');
const { authenticateToken } = require('../middleware/authMiddleware');


const router = express.Router();

//VIEW ACCOUNT
// router.get('/', viewAccount);

//CHANGE PASSWORD
router.put('/changePassword', authenticateToken, changePassword);

module.exports = router;
    