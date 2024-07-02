const express = require('express');
const { register, login } = require('../controllers/userController');
const router = express.Router();
const { check } = require('express-validator');

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


module.exports = router;