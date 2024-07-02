const pool = require('../../../config/db');
const bcrypt = require('bcrypt');

//all of these require authentication? 

const changePassword = async (req, res) => {
    const { userId } = req;
    const { password, newPassword } = req.body;
    try {
        if (!password) return res.status(400).json({"error": "please enter your password"});

        let oldPassword = await pool.query("select password from users where id = $1", [userId])

        const isCorrectPassword = await bcrypt.compare(password, oldPassword.rows[0].password);

        if (!isCorrectPassword) {
            return res.status(401).json({"error": "incorrect password"})
        }
        
        if (!newPassword) return res.status(400).json({"error": "please provide newPassword"});

        if (newPassword.length < 6) return res.status(400).json({"error": "newPassword length must be atleast 6 characters long"});
        
        let newPasswordHashed = await bcrypt.hash(newPassword, 10);


        let isSamePassword = await bcrypt.compare(newPassword, oldPassword.rows[0].password);
        if (isSamePassword) return res.status(409).json({"error": "newPassword cannot be the same as old password"});

        await pool.query('update users set password = $1 where id = $2', [newPasswordHashed, userId]);

        return res.status(200).json({"message": "password changed successfully"}); 
        
    } catch (err) {
        console.error(err);
        return res.status(500).json({"error": "internal server error"})
    }
  
    
    
}
 
module.exports = { changePassword };

