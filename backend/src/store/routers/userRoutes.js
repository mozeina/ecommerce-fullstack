const express = require('express');
const { register, login, logout } = require('../controllers/userController');
const router = express.Router();
const { check } = require('express-validator');
const { authenticateToken } = require("../middleware/authMiddleware");

router.post('/register', [
    check("username").isLength({ min: 3 }).withMessage('Username must be atleast 3 characters long.'),
    check("email").isEmail().withMessage('Please enter a valid email.'),
    check("password")
    .isLength({ min: 6 }).withMessage('Password must be atleast 6 characters long.')
    .matches(/^\S+$/).withMessage('Password must not contain spaces.')
], register);

router.post('/login', [
    check("email").isEmail().withMessage('Please enter a valid email.'),
    check('password').not().isEmpty().withMessage('Password is required.')
], login);

router.get("/logout", authenticateToken, logout);

module.exports = router;    