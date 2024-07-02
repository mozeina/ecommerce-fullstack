const pool = require('../../../config/db')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { validationResult } = require('express-validator');


const register = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, email } = req.body;

    try {

        // throw Error('deliberate error');

        const userExists = await pool.query('SELECT * FROM users WHERE email = $1 ', [email]);

        if (userExists.rows.length > 0) {
            return res.status(409).json({ "error": "User already exists, try logging in" });

        }

        const hashedPassword = await bcrypt.hash(password, 10);         

        const newUser = await pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *', [username, email, hashedPassword]);

        const userId = newUser.rows[0].id;

        await pool.query('INSERT INTO carts (user_id) VALUES ($1)', [userId]);
    

        const token = jwt.sign({ userId: newUser.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ "error": "Internal server error" })
    }


};


const login = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {   

        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (user.rows.length == 0) {
            return res.status(404).json({ "error": "User doesn't exist, please register a new account" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.rows[0].password);

        if (!isPasswordValid) {
            return res.status(401).json({ "error": "Incorrect password" })
        }

        const token = jwt.sign({ userId: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        
        res.status(200).json({ token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ "error": "Server error" })
    }
}



module.exports = { register, login };






