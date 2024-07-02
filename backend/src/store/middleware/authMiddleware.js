const jwt = require('jsonwebtoken');
require('dotenv').config();


const authenticateToken = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const authToken = authHeader && authHeader.split(' ')[1];

    if (!authToken) {
        return res.status(401).json({ "error": "Unauthorized" });
    }

    jwt.verify(authToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error(`failed to authorize token, ${err}`)
            res.status(403).json({ "error": "failed to authorized token, try logging in again" });
        } else if (decoded) {
            req.userId = decoded.userId;
            next();
        }
    })

};

module.exports = { authenticateToken };