const jwt = require('jsonwebtoken');
require('dotenv').config();


const authenticateToken = (req, res, next) => {

    const authToken = req.cookies['auth-token'];

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

const checkAuth = (req, res) => {

    const authToken = req.cookies['auth-token'];

    if (!authToken) {
        return res.status(401).json({ "error": "Unauthorized" });
    }

    jwt.verify(authToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error(`failed to authorize token, ${err}`)
            res.status(403).json({ "error": "failed to authorized token, try logging in again" });
        } else if (decoded) {
            res.status(200).json({"message": "authorization success"});
        }
    })
}

module.exports = { authenticateToken, checkAuth };